"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashToLanding from "./(landing)/page";
import { useUserStore } from "@/context/useUserStore";
import { auth } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isVerified = useUserStore((state) => state.isVerified);
  const fetchBackendProfile = useUserStore((state) => state.fetchBackendProfile);

  // On hard refresh, validate active Firebase session and hydrate backend profile.
  useEffect(() => {
    let isMounted = true;

    const checkAuthOnRefresh = async () => {
      try {
        if (auth?.currentUser) {
          await fetchBackendProfile();
        }
      } catch (error) {
        console.warn("Auth check on refresh failed:", error);
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    void checkAuthOnRefresh();

    return () => {
      isMounted = false;
    };
  }, [fetchBackendProfile]);

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      if (isVerified === false) {
        router.replace("/verification-pending");
        return;
      }

      router.replace("/home");
    }
  }, [isAuthenticated, isCheckingAuth, isVerified, router]);

  // Prevent a quick landing-page flash for authenticated users
  if (isAuthenticated) return null;

  return <SplashToLanding />;
}