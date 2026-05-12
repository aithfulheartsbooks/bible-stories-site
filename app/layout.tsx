import type { Metadata } from "next";
import { Fraunces, Quicksand } from "next/font/google";
import Script from "next/script";
import AskAngelWidget from "@/components/AskAngelWidget";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-56F5YQWQE9";

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
  },
  other: {
    "p:domain_verify": "00b7e44b7c949bfae0fdb2abb0184a82",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${quicksand.variable}`}>
      <body className="font-body">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script id="amazon-click-tracking" strategy="afterInteractive">
          {`
            document.addEventListener('click', function (event) {
              var link = event.target.closest && event.target.closest('a[href*="amazon.com"]');
              if (!link || typeof window.gtag !== 'function') return;

              var params = new URLSearchParams(window.location.search);
              var bookTitle =
                link.closest('article')?.querySelector('h3')?.textContent?.trim() ||
                document.querySelector('h1')?.textContent?.trim() ||
                document.title;

              window.gtag('event', 'amazon_click', {
                book_title: bookTitle,
                link_url: link.href,
                page_path: window.location.pathname,
                page_url: window.location.href,
                referrer_url: document.referrer || '',
                utm_source: params.get('utm_source') || '',
                utm_medium: params.get('utm_medium') || '',
                utm_campaign: params.get('utm_campaign') || ''
              });
            });
          `}
        </Script>
        {children}
        <AskAngelWidget />
      </body>
    </html>
  );
}
