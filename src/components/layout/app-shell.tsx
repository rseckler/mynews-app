"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "./bottom-nav";
import { ConsentBanner } from "./consent-banner";
import { SiteFooter } from "./site-footer";

/** Pages that should NOT show the bottom navigation */
const HIDE_NAV_PATHS = ["/onboarding"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_PATHS.includes(pathname);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {showNav && <SiteFooter />}
      {showNav && <BottomNav />}
      {showNav && <ConsentBanner />}
    </>
  );
}
