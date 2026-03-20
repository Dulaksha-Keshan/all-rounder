"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "@/layout/navbar2";
import Footer from "@/layout/Footer";
import GoToTopButton from "@/components/GoToTopButton";
import GlobalCursorFX from "@/components/GlobalCursorFX";
import AppToastHost from "@/components/AppToastHost";
import InteractiveStarfieldBackground from "@/components/InteractiveStarfieldBackground";
import { useUserStore } from "@/context/useUserStore";
import { auth } from "@/lib/firebase";

const UNVERIFIED_ROUTE = "/verification-pending";

const shouldSkipBackendHydration = (pathname: string | null) => {
  if (!pathname) {
    return false;
  }

  return (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signUp") ||
    pathname.startsWith("/vision") ||
    pathname.startsWith("/help")
  );
};

interface RootAppShellProps {
  children: ReactNode;
}

export default function RootAppShell({ children }: RootAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isBootstrappingAuth, setIsBootstrappingAuth] = useState(true);

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const currentUser = useUserStore((state) => state.currentUser);
  const isVerified = useUserStore((state) => state.isVerified);
  const fetchBackendProfile = useUserStore((state) => state.fetchBackendProfile);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        if (shouldSkipBackendHydration(pathname)) {
          return;
        }

        if (auth?.currentUser && (!isAuthenticated || !currentUser)) {
          await fetchBackendProfile();
        }
      } catch (error) {
        console.warn("Initial auth bootstrap failed:", error);
      } finally {
        if (isMounted) {
          setIsBootstrappingAuth(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [currentUser, fetchBackendProfile, isAuthenticated, pathname]);

  const isUnverifiedUser = useMemo(() => {
    if (!isAuthenticated) {
      return false;
    }

    if (isVerified === false) {
      return true;
    }

    return currentUser?.is_verified === false;
  }, [currentUser, isAuthenticated, isVerified]);

  useEffect(() => {
    if (isBootstrappingAuth) {
      return;
    }

    if (isUnverifiedUser && pathname !== UNVERIFIED_ROUTE) {
      router.replace(UNVERIFIED_ROUTE);
      return;
    }

    if (!isUnverifiedUser && pathname === UNVERIFIED_ROUTE) {
      router.replace(isAuthenticated ? "/home" : "/");
    }
  }, [isAuthenticated, isBootstrappingAuth, isUnverifiedUser, pathname, router]);

  const hideChrome = pathname === UNVERIFIED_ROUTE;
  const showGlobalStarfield = pathname !== UNVERIFIED_ROUTE;
  const isLandingRoute = pathname === "/";

  if (isBootstrappingAuth) {
    return null;
  }

  if ((isUnverifiedUser && pathname !== UNVERIFIED_ROUTE) || (!isUnverifiedUser && pathname === UNVERIFIED_ROUTE)) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {showGlobalStarfield && (
        <InteractiveStarfieldBackground
          variant={isLandingRoute ? "landing" : "default"}
          starCount={isLandingRoute ? 260 : 180}
          className={`fixed inset-0 ${isLandingRoute ? "opacity-[0.95]" : "opacity-[0.96]"}`}
        />
      )}
      <GlobalCursorFX />
      <AppToastHost />
      <div className="relative z-10">
        {!hideChrome && <Navbar />}
        <main className={hideChrome ? "" : "pt-20 md:pt-28"}>{children}</main>
        {!hideChrome && <Footer />}
        {!hideChrome && <GoToTopButton />}
      </div>
    </div>
  );
}
