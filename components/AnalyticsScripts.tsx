"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AskAngelWidget from "@/components/AskAngelWidget";
import { bootAnalytics, isPlayPath } from "@/lib/analytics-traffic";

export default function AnalyticsScripts() {
  const pathname = usePathname();

  useEffect(() => {
    bootAnalytics(window, { sendPageView: !isPlayPath(pathname) });
  }, [pathname]);

  return <AskAngelWidget />;
}
