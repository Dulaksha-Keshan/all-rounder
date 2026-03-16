import { render, screen, waitFor } from "@testing-library/react";

import HomeClient from "../../../src/app/home/HomeClient";

const useSearchParamsMock = jest.fn();

const fetchFeedMock = jest.fn();
const fetchMyPostsMock = jest.fn();

const postState = {
  feedItems: [
    { id: "p1", feedType: "post", data: { id: "p1" } },
    { id: "p2", feedType: "post", data: { id: "p2" } },
    { id: "e1", feedType: "event", data: { id: "e1" } },
  ],
  postsById: {
    p1: {
      id: "p1",
      title: "Math Contest",
      content: "Regional math championship",
    },
    p2: {
      id: "p2",
      title: "Art Club",
      content: "Creative drawing workshop",
    },
  },
  isFetchingFeed: false,
  isFetchingPosts: false,
  fetchFeed: fetchFeedMock,
  fetchMyPosts: fetchMyPostsMock,
};

const homeState = {
  stats: {
    totalPosts: 2,
    totalEvents: 1,
  },
};

const userState = {
  followRequests: [],
  acceptFollowRequest: jest.fn(),
  declineFollowRequest: jest.fn(),
  currentUser: { uid: "u1" },
};

const studentState = {
  students: [
    { uid: "s1", name: "Mathilda", profile_picture: "" },
    { uid: "s2", name: "Chris", profile_picture: "" },
  ],
};

const teacherState = {
  teachers: [
    { uid: "t1", name: "Mr. Maths", profile_picture: "" },
    { uid: "t2", name: "Ms. Music", profile_picture: "" },
  ],
};

jest.mock("next/navigation", () => ({
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock("@/context/usePostStore", () => ({
  usePostStore: (selector: (state: typeof postState) => unknown) =>
    selector(postState),
}));

jest.mock("@/context/useHomeStore", () => ({
  useHomeStore: (selector: (state: typeof homeState) => unknown) =>
    selector(homeState),
}));

jest.mock("@/context/useUserStore", () => ({
  useUserStore: (selector: (state: typeof userState) => unknown) =>
    selector(userState),
}));

jest.mock("@/context/useStudentStore", () => ({
  useStudentStore: (selector: (state: typeof studentState) => unknown) =>
    selector(studentState),
}));

jest.mock("@/context/useTeacherStore", () => ({
  useTeacherStore: (selector: (state: typeof teacherState) => unknown) =>
    selector(teacherState),
}));

jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    fromTo: jest.fn(),
  },
}));

jest.mock("../../../src/app/home/_components/HomeStats", () => ({
  __esModule: true,
  default: () => <div data-testid="home-stats" />,
}));

jest.mock("../../../src/app/home/_components/QuickActions", () => ({
  __esModule: true,
  default: () => <div data-testid="quick-actions" />,
}));

jest.mock("../../../src/app/home/_components/UpcomingEvents", () => ({
  __esModule: true,
  default: () => <div data-testid="upcoming-events" />,
}));

jest.mock("../../../src/components/SearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar" />,
}));

jest.mock("../../../src/app/home/_components/Feed", () => ({
  __esModule: true,
  default: ({ posts, isLoading }: { posts: Array<{ title: string }>; isLoading: boolean }) => (
    <div data-testid="feed">
      {isLoading ? "loading" : "ready"}::{posts.map((post) => post.title).join(",")}
    </div>
  ),
}));

describe("HomeClient integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls feed and post fetch actions on mount", async () => {
    useSearchParamsMock.mockReturnValue({
      get: (_key: string) => null,
    });

    render(<HomeClient />);

    await waitFor(() => {
      expect(fetchFeedMock).toHaveBeenCalledTimes(1);
      expect(fetchMyPostsMock).toHaveBeenCalledTimes(1);
    });
  });

  it("filters feed posts and people using search query", () => {
    useSearchParamsMock.mockReturnValue({
      get: (key: string) => (key === "search" ? "math" : null),
    });

    render(<HomeClient />);

    expect(screen.getByTestId("feed")).toHaveTextContent("ready::Math Contest");
    expect(screen.getByText("Mathilda")).toBeInTheDocument();
    expect(screen.getByText("Mr. Maths")).toBeInTheDocument();
    expect(screen.queryByText("Chris")).not.toBeInTheDocument();
    expect(screen.queryByText("Ms. Music")).not.toBeInTheDocument();
  });
});
