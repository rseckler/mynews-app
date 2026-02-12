"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { InterestPicker } from "@/components/onboarding/interest-picker";
import { Feed } from "@/components/news/feed";
import type { Category } from "@/types";

const ONBOARDING_KEY = "mynews-onboarding-done";

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Allow skipping onboarding via URL param (for testing/screenshots)
    const params = new URLSearchParams(window.location.search);
    if (params.get("skip-onboarding")) {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
    const done = localStorage.getItem(ONBOARDING_KEY);
    setShowOnboarding(!done);
  }, []);

  function handleOnboardingComplete(categories: Category[]) {
    localStorage.setItem(ONBOARDING_KEY, "true");
    localStorage.setItem("mynews-interests", JSON.stringify(categories));
    setShowOnboarding(false);
  }

  // Don't render anything until we know if onboarding is needed (avoids flash)
  if (showOnboarding === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="size-1.5 animate-pulse rounded-full bg-primary" />
            <div className="size-1.5 animate-pulse rounded-full bg-primary/60" />
            <div className="size-1.5 animate-pulse rounded-full bg-primary/60" />
            <div className="size-1.5 animate-pulse rounded-full bg-primary/30" />
          </div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="bg-background">
        <InterestPicker onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <Feed />
      </main>
    </div>
  );
}
