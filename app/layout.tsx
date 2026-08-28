import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_URL, SERVICE_AREAS } from "@/lib/site";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400;1,6..72,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
