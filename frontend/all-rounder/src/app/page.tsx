"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashToLanding from "./(landing)/page";
import { useUserStore } from "@/context/useUserStore";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  // Prevent a quick landing-page flash for authenticated users
  if (isAuthenticated) return null;

  return <SplashToLanding />;
}