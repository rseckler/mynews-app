"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";
import { ConsentBanner } from "./consent-banner";

/** Pages that should NOT show the bottom navigation */
const HIDE_NAV_PATHS = ["/onboarding"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_PATHS.includes(pathname);

  return (
    <>
      {children}
      {showNav && <BottomNav />}
      {showNav && <ConsentBanner />}
    </>
  );
}
