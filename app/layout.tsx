import type { Metadata, Viewport } from "next";
import { Fraunces, Quicksand } from "next/font/google";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.faithfulheartsbooks.com"),
  title: "Bible Stories for Little Hearts",
  description:
    "Warm, gentle retellings of the greatest Bible stories — beautifully illustrated picture books for children ages 3 to 8.",
  keywords: [
    "Christian children's books",
    "Bible stories for kids",
    "picture books ages 3-8",
    "Sunday school books",
    "faith-based children's books",
  ],
  openGraph: {
    title: "Bible Stories for Little Hearts",
    description:
      "Beautifully illustrated Bible picture books for children ages 3 to 8.",
    type: "website",
    url: "/",
    siteName: "Bible Stories for Little Hearts",
    images: [
      {
        url: "/Faith_Rivers.png",
        width: 1024,
        height: 1024,
        alt: "Faith Rivers and Bible Stories for Little Hearts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Stories for Little Hearts",
    description:
      "Beautifully illustrated Bible picture books for children ages 3 to 8.",
    images: ["/Faith_Rivers.png"],
  },
  other: {
    "p:domain_verify": "00b7e44b7c949bfae0fdb2abb0184a82",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/play-corner-192-v2.png",
    apple: "/icons/apple-touch-icon-v2.png",
  },
  appleWebApp: {
    capable: true,
    title: "Play Corner",
    statusBarStyle: "default",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF3E0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${quicksand.variable}`}>
      <body className="font-body">
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
