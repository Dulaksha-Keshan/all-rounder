import mongoose from "mongoose";


const likeSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    userIds: {
      type: [String], 
      default: [],
    },
  },
  { _id: false }
);


const commentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    comment: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["achievement", "participation", "event", "project"],
      default: "achievement",
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    attachments: {
      type: [String], // image URLs, certificate URLs, etc.
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    authorType: {
      type: String,
      enum: ["STUDENT", "SCHOOL", "ORGANIZATION"],
      required: true,
    },

    authorId: {
      type: String,
      required: true,
    },
    likes: {
      type: likeSchema,
      default: () => ({
        count: 0,
        userIds: [],
      }),
    },

    comments: {
      type: [commentSchema],
      default: [],
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);


postSchema.index({ authorId: 1 });
postSchema.index({ category: 1 });
postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);