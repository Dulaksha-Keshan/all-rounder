import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import LoginPage from "../../../src/app/login/page";
import { useUserStore } from "@/context/useUserStore";

const pushMock = jest.fn();

type UserStoreState = {
  loginWithEmail: jest.Mock<Promise<void>, [string, string]>;
  loginWithGoogle: jest.Mock<Promise<void>, [unknown]>;
  isLoading: boolean;
  error: string | null;
};

const useUserStoreMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/context/useUserStore", () => ({
  useUserStore: (selector: (state: UserStoreState) => unknown) =>
    useUserStoreMock(selector),
}));

describe("login page", () => {
  let state: UserStoreState;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      loginWithEmail: jest.fn().mockResolvedValue(undefined),
      loginWithGoogle: jest.fn().mockResolvedValue(undefined),
      isLoading: false,
      error: null,
    };

    useUserStoreMock.mockImplementation(
      (selector: (s: UserStoreState) => unknown) => selector(state),
    );

    (useUserStore as unknown as { getState: () => UserStoreState }).getState = () =>
      state;
  });

  it("renders login form elements", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", {
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    ).toBeInTheDocument();
  });

  it("submits credentials and redirects when login succeeds", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    );

    await waitFor(() => {
      expect(state.loginWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
    });

    expect(pushMock).toHaveBeenCalledWith("/home");
  });

  it("does not redirect when store has an error after login attempt", async () => {
    state.loginWithEmail.mockImplementation(async () => {
      state.error = "Invalid credentials";
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong-password" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    );

    await waitFor(() => {
      expect(state.loginWithEmail).toHaveBeenCalled();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
