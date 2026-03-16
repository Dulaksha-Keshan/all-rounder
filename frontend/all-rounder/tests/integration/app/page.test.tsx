import { render, screen, waitFor } from "@testing-library/react";

import Home from "../../../src/app/page";

const replaceMock = jest.fn();
const useUserStoreMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock("@/context/useUserStore", () => ({
  useUserStore: (selector: (state: { isAuthenticated: boolean }) => boolean) =>
    useUserStoreMock(selector),
}));

jest.mock("../../../src/app/(landing)/page", () => ({
  __esModule: true,
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));

describe("app root page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders landing page for unauthenticated users", () => {
    useUserStoreMock.mockImplementation(
      (selector: (state: { isAuthenticated: boolean }) => boolean) =>
        selector({ isAuthenticated: false }),
    );

    render(<Home />);

    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects authenticated users to /home", async () => {
    useUserStoreMock.mockImplementation(
      (selector: (state: { isAuthenticated: boolean }) => boolean) =>
        selector({ isAuthenticated: true }),
    );

    const { container } = render(<Home />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/home");
    });

    expect(container).toBeEmptyDOMElement();
  });
});
