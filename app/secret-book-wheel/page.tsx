import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import BookPrizeWheelClient from "./BookPrizeWheelClient";

export const metadata: Metadata = {
  title: "Private Book Prize Wheel",
  description: "Hidden book prize wheel test page.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/secret-book-wheel",
  },
};

export default function SecretBookWheelPage() {
  return (
    <main className="relative min-h-screen overflow-hidden font-body text-chestnut">
      <div className="scenery" />
      <div className="cloud animate-drift-slow h-[60px] w-[180px] top-[8%] left-[-200px]" />
      <div
        className="cloud animate-drift-long h-[45px] w-[140px] top-[18%] left-[-200px]"
        style={{ animationDelay: "-30s" }}
      />
      <div
        className="cloud animate-drift-medium h-[70px] w-[220px] top-[4%] left-[-200px]"
        style={{ animationDelay: "-60s" }}
      />

      <SiteNav />
      <BookPrizeWheelClient />
    </main>
  );
}
