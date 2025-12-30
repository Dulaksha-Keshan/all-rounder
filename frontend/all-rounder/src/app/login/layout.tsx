import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | All-Rounder",
  description: "Sign in to your All-Rounder account",
  icons: {
    icon: "/icons/browserImg.png",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}