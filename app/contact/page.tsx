import type { Metadata } from "next";
import ContactFormClient from "./ContactFormClient";

export const metadata: Metadata = {
  title: "Contact Faith Rivers | Bible Stories for Little Hearts",
  description:
    "Contact Faith Rivers about Bible Stories for Little Hearts, church or bulk order questions, collaborations, and website feedback.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Faith Rivers | Bible Stories for Little Hearts",
    description:
      "Reach out about Christian children's books, Bible story resources, church orders, collaborations, and website feedback.",
    url: "/contact",
    type: "website",
    images: [
      {
        url: "/Faith_Rivers.png",
        alt: "Faith Rivers and Bible Stories for Little Hearts",
      },
    ],
  },
};

export default function ContactPage() {
  return <ContactFormClient />;
}
