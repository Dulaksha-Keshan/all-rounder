import Post from "../mongoose/postModel.js";
import Event from "../mongoose/eventModel.js";
import axios from "axios";

export interface FeedItem {
  _id: string;
  title: string;
  createdAt: Date;
  feedType: "post" | "event";
  [key: string]: any;
}

/**
 * RecommendationEngine
 * 
 * An independent logic layer responsible for the content feeding algorithm.
 * Decoupled from Express req/res objects to allow for portability and testing.
 */
export class RecommendationEngine {
  private static USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3001";

  /**
   * Generates a personalized feed of posts and events based on user skills.
   */
  static async getPersonalizedFeed(
    userUid?: string,
    userType?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    let skills: any[] = [];

    // 1. Fetch skills from User Service if user is a student
    if (userUid && userType === "STUDENT") {
      skills = await this.fetchUserSkills(userUid, userType);
    }

    // 2. Construct database filters based on discovered skills
    const { postFilter, eventFilter } = this.buildFilters(skills);

    // 3. Fetch raw data from MongoDB
    // We fetch (skip + limit) items to ensure we can accurately sort/rank across both collections
    const [posts, events] = await Promise.all([
      Post.find(postFilter).sort({ createdAt: -1 }).limit(skip + limit),
      Event.find(eventFilter).sort({ createdAt: -1 }).limit(skip + limit)
    ]);

    // 4. Execute the ranking algorithm (merging and sorting by recency)
    const combinedFeed = this.rankContent(posts, events, skip, limit);

    // 5. Calculate pagination metadata
    const [totalPosts, totalEvents] = await Promise.all([
      Post.countDocuments(postFilter),
      Event.countDocuments(eventFilter)
    ]);

    const totalItems = totalPosts + totalEvents;

    return {
      feed: combinedFeed,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: skip + limit < totalItems,
      }
    };
  }

  /**
   * Internal client to communicate with User Service.
   */
  private static async fetchUserSkills(uid: string, type: string) {
    try {
      const response = await axios.get(`${this.USER_SERVICE_URL}/api/skills/users`, {
        headers: {
          "x-user-uid": uid,
          "x-user-type": type
        },
        timeout: 2000 // Ensure engine doesn't hang if service is slow
      });
      return response.data.skills || [];
    } catch (error) {
      console.warn(`[RecommendationEngine] Could not fetch skills for user ${uid}:`, (error as Error).message);
      return []; // Fallback to empty skills
    }
  }

  /**
   * Builds the MongoDB query filters.
   */
  private static buildFilters(skills: any[]) {
    const postFilter: any = { isDeleted: false, visibility: "public" };
    const eventFilter: any = { isDeleted: false, visibility: "public" };

    if (skills && skills.length > 0) {
      const skillNames = skills.map(s => s.skill_name);
      const categories = [...new Set(skills.map(s => s.category))];

      // Match posts by category OR if any tag matches a skill name
      postFilter.$or = [
        { category: { $in: categories } },
        { tags: { $in: skillNames } }
      ];

      // Match events by category
      eventFilter.category = { $in: categories };
    }

    return { postFilter, eventFilter };
  }

  /**
   * Merges and sorts the different content types.
   */
  private static rankContent(posts: any[], events: any[], skip: number, limit: number) {
    const merged = [
      ...posts.map(p => ({ ...p.toObject(), feedType: "post" })),
      ...events.map(e => ({ ...e.toObject(), feedType: "event" }))
    ];

    // Rank primarily by creation date (recency)
    // Future iterations can add "Interest Score" multipliers here
    return merged
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(skip, skip + limit);
  }
}
