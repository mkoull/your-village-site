import Hero from "@/components/home/Hero";
import EmpathySection from "@/components/home/EmpathySection";
import WhatHappensSection from "@/components/home/WhatHappensSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import ExistingSupportSection from "@/components/home/ExistingSupportSection";
import FounderSection from "@/components/home/FounderSection";
import CoverageSection from "@/components/home/CoverageSection";
import FaqSection from "@/components/home/FaqSection";
import WaitlistCapture from "@/components/home/WaitlistCapture";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <ExistingSupportSection />
      <EmpathySection />
      <WhatHappensSection />
      <FounderSection />
      <CoverageSection />
      <FaqSection />
      <WaitlistCapture />
    </>
  );
}
