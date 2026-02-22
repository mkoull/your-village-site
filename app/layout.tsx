import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Your Village — Postpartum Support, Coordinated",
    template: "%s — Your Village",
  },
  description:
    "Curated postpartum care — from meals and overnight help to emotional support — coordinated seamlessly around your family. Inner Melbourne, Australia.",
  metadataBase: new URL("https://yourvillage.com.au"),
  openGraph: {
    title: "Your Village — Postpartum Support, Coordinated",
    description:
      "Curated postpartum care — from meals and overnight help to emotional support — coordinated seamlessly around your family.",
    type: "website",
    locale: "en_AU",
    url: "https://yourvillage.com.au",
  },
  icons: {
    icon: "/favicon.svg",
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
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
