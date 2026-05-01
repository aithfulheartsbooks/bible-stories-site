import type { Metadata } from "next";
import { Fraunces, Quicksand } from "next/font/google";
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${quicksand.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
