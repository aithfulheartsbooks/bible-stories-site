"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-56F5YQWQE9";

export default function AnalyticsScripts() {
  const pathname = usePathname();

  if (pathname === "/play" || pathname.startsWith("/play/")) {
    return null;
  }

  return (
    <>
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

            var bookTitle =
              link.closest('article')?.querySelector('h3')?.textContent?.trim() ||
              document.querySelector('h1')?.textContent?.trim() ||
              document.title;

            window.gtag('event', 'amazon_click', {
              book_title: bookTitle,
              link_url: link.href,
              page_path: window.location.pathname
            });
          });
        `}
      </Script>
    </>
  );
}
