import { render, screen } from "@testing-library/react";
import { act } from "react";

import SplashToLanding from "../../../src/app/(landing)/page";

jest.mock("../../../src/app/(landing)/_components/SplashScreen", () => ({
  __esModule: true,
  default: () => <div>Splash Screen</div>,
}));

jest.mock("../../../src/app/(landing)/_components/LandingPage", () => ({
  __esModule: true,
  default: () => <div>Landing Page</div>,
}));

describe("landing transition page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("skips splash when navigation flag exists", () => {
    sessionStorage.setItem("isNavigating", "true");

    render(<SplashToLanding />);

    expect(screen.getByText("Landing Page")).toBeInTheDocument();
    expect(screen.queryByText("Splash Screen")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("isNavigating")).toBeNull();
  });

  it("shows splash first and then transitions to landing", () => {
    jest.useFakeTimers();

    render(<SplashToLanding />);

    expect(screen.getByText("Splash Screen")).toBeInTheDocument();
    expect(screen.queryByText("Landing Page")).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(screen.getByText("Landing Page")).toBeInTheDocument();
    expect(screen.queryByText("Splash Screen")).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
