import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_URL, SERVICE_AREAS } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Your Village — Postpartum Support, Inner Melbourne",
    template: "%s — Your Village",
  },
  description:
    "It takes a village. We build yours — meals, overnight care, feeding and emotional support from vetted providers, coordinated for your family. Inner Melbourne, Australia.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Your Village — Postpartum Support, Inner Melbourne",
    description:
      "It takes a village. We build yours — meals, overnight care, feeding and emotional support from vetted providers, coordinated for your family.",
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Your Village",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Your Village — It takes a village. We build yours.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Village — Postpartum Support, Inner Melbourne",
    description:
      "It takes a village. We build yours — vetted postpartum support, coordinated for your family.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Your Village",
  description:
    "Curated postpartum support for families in inner Melbourne. One team assembles and coordinates vetted providers — meals, postpartum carers, overnight care, sleep and lactation support, counselling, household help.",
  url: SITE_URL,
  areaServed: SERVICE_AREAS.map((suburb) => ({
    "@type": "Place",
    name: `${suburb}, Victoria, Australia`,
  })),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Melbourne",
    addressRegion: "VIC",
    addressCountry: "AU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
