import Hero from "@/components/home/Hero";
import EmpathySection from "@/components/home/EmpathySection";
import ConstellationSection from "@/components/home/ConstellationSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import EcosystemSection from "@/components/home/EcosystemSection";
import TrustSection from "@/components/home/TrustSection";
import FounderSection from "@/components/home/FounderSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import WaitlistCapture from "@/components/home/WaitlistCapture";
import StickyMobileCta from "@/components/home/StickyMobileCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EmpathySection />
      <ConstellationSection />
      <ServicesPreview />
      <EcosystemSection />
      <TrustSection />
      <FounderSection />
      <TestimonialsSection />
      <FaqSection />
      <WaitlistCapture />
      <StickyMobileCta />
    </>
  );
}
