import type { Metadata } from "next";
import InstagramClient from "./InstagramClient";

export const metadata: Metadata = {
  title: "Instagram Management",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <InstagramClient />;
}
