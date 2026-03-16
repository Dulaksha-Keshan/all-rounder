import { fireEvent, render, screen } from "@testing-library/react";

import GoToTopButton from "../../../src/components/GoToTopButton";

describe("GoToTopButton", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  it("is hidden by default", () => {
    render(<GoToTopButton />);

    const button = screen.getByRole("button", { name: /go to top/i });
    expect(button.className).toContain("pointer-events-none");
  });

  it("becomes visible after scroll and scrolls to top on click", () => {
    const scrollToMock = jest.fn();
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      writable: true,
      value: scrollToMock,
    });

    render(<GoToTopButton />);

    window.scrollY = 350;
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: /go to top/i });
    expect(button.className).toContain("opacity-100");

    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
