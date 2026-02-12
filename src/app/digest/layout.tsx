import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abend-Digest",
  description: "Dein täglicher Tagesrückblick mit den wichtigsten Nachrichten.",
};

export default function DigestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
