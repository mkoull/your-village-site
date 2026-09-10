import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import SiteAnalytics from "@/components/layout/SiteAnalytics";
import { VillageProvider } from "@/components/village/VillageProvider";
import VillageDock from "@/components/village/VillageDock";
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
    default: "Your Village — Support for you and your family",
    template: "%s — Your Village",
  },
  description:
    "Find the support that fits your life. Explore meals, nannies, mental health, household help and community with Your Village.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Your Village — Support for you and your family",
    description:
      "Find the support that fits your life. Explore meals, nannies, mental health, household help and community with Your Village.",
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Your Village",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Your Village — Support for you and your family",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Village — Support for you and your family",
    description:
      "Find the support that fits your life. Explore meals, nannies, mental health, household help and community with Your Village.",
    images: ["/opengraph-image"],
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
    "A place for mothers and families to explore practical help, childcare, mental health support and community at every stage of life.",
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <VillageProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <VillageDock />
        </VillageProvider>
        <SiteAnalytics />
      </body>
    </html>
  );
}
