import { fireEvent, render, screen } from "@testing-library/react";

import Pagination from "../../../src/components/Pagination";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("Pagination integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, "", "/events");
  });

  it("navigates to previous page when Prev is clicked", () => {
    render(<Pagination page={2} count={20} />);

    fireEvent.click(screen.getByRole("button", { name: /prev/i }));

    expect(pushMock).toHaveBeenCalledWith("/events?page=1");
  });

  it("navigates to next page when Next is clicked", () => {
    render(<Pagination page={2} count={20} />);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(pushMock).toHaveBeenCalledWith("/events?page=3");
  });

  it("disables Prev on first page", () => {
    render(<Pagination page={1} count={20} />);

    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(<Pagination page={4} count={20} />);

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
