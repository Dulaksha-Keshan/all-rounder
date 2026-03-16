import { render, screen } from "@testing-library/react";

import Footer from "../../../src/layout/Footer";

describe("Footer", () => {
  it("renders branding and key social links", () => {
    render(<Footer />);

    expect(
      screen.getByText(/empowering students to explore, excel, and shine/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /linkedin/i,
      }),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/all-rounder-lk/posts/?feedView=all",
    );

    expect(
      screen.getByRole("link", {
        name: /instagram/i,
      }),
    ).toHaveAttribute("href", "https://www.instagram.com/allrounder_lk");

    expect(
      screen.getByRole("link", {
        name: /github/i,
      }),
    ).toHaveAttribute("href", "https://github.com/Dulaksha-Keshan/all-rounder");
  });
});
