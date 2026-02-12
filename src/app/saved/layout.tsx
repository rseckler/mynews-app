import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gespeicherte Artikel",
  description: "Deine gespeicherten Artikel auf MyNews.com.",
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
