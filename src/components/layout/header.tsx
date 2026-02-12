"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Moon,
  Sun,
  Search,
  Sparkles,
  BookmarkCheck,
  User,
  Moon as MoonIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEME_KEY = "mynews-theme";

interface DesktopNavItem {
  label: string;
  href: string;
  matchPaths?: string[];
}

const DESKTOP_NAV: DesktopNavItem[] = [
  { label: "Suche", href: "/search" },
  { label: "Briefing", href: "/briefing", matchPaths: ["/briefing", "/digest"] },
  { label: "Gemerkt", href: "/saved" },
  { label: "Profil", href: "/profile" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemChange(e: MediaQueryListEvent) {
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored) {
        const dark = e.matches;
        document.documentElement.classList.toggle("dark", dark);
        setIsDark(dark);
      }
    }
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => { window.location.href = "/"; }}
            className="flex cursor-pointer items-center gap-1.5"
          >
            <div className="grid grid-cols-2 gap-0.5">
              <div className="size-1.5 rounded-full bg-primary" />
              <div className="size-1.5 rounded-full bg-primary/60" />
              <div className="size-1.5 rounded-full bg-primary/60" />
              <div className="size-1.5 rounded-full bg-primary/30" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              MYNEWS
            </span>
            <span className="hidden text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase xl:inline">
              curated for you
            </span>
          </button>

          {/* Desktop navigation links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {DESKTOP_NAV.map((item) => {
              const isActive = item.matchPaths
                ? item.matchPaths.includes(pathname)
                : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Suche"
            onClick={() => router.push("/search")}
          >
            <Search className="size-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Briefing"
            onClick={() => router.push("/briefing")}
          >
            <Sparkles className="size-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
            aria-label={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
