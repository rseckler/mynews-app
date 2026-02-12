import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
  description: "Dein Profil und Einstellungen auf MyNews.com.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
