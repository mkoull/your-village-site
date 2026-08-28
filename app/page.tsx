import Hero from "@/components/home/Hero";
import EmpathySection from "@/components/home/EmpathySection";
import WhatHappensSection from "@/components/home/WhatHappensSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import TrustSection from "@/components/home/TrustSection";
import FounderSection from "@/components/home/FounderSection";
import FoundingFamiliesSection from "@/components/home/FoundingFamiliesSection";
import CoverageSection from "@/components/home/CoverageSection";
import FaqSection from "@/components/home/FaqSection";
import WaitlistCapture from "@/components/home/WaitlistCapture";
import StickyMobileCta from "@/components/home/StickyMobileCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EmpathySection />
      <WhatHappensSection />
      <ServicesPreview />
      <TrustSection />
      <FounderSection />
      <FoundingFamiliesSection />
      <CoverageSection />
      <FaqSection />
      <WaitlistCapture />
      <StickyMobileCta />
    </>
  );
}
