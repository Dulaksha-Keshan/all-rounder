import { fireEvent, render, screen } from "@testing-library/react";

import SearchBar from "../../../src/components/SearchBar";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("SearchBar integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, "", "/home");
  });

  it("updates query param on input change", () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "science" },
    });

    expect(pushMock).toHaveBeenCalledWith("/home?search=science");
  });

  it("removes search query param when input is cleared", () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "math" },
    });

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "" },
    });

    expect(pushMock).toHaveBeenCalledWith("/home?");
  });

  it("submits via form and pushes updated query", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "debate" } });
    fireEvent.submit(input.closest("form")!);

    expect(pushMock).toHaveBeenCalledWith("/home?search=debate");
  });
});
