import Hero from "@/components/home/Hero";
import ConstellationSection from "@/components/home/ConstellationSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import TrustStatsSection from "@/components/home/TrustStatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SupportFinder from "@/components/home/SupportFinder";
import WaitlistCapture from "@/components/home/WaitlistCapture";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ConstellationSection />
      <EcosystemSection />
      <TrustStatsSection />
      <TestimonialsSection />
      <SupportFinder />
      <WaitlistCapture />
    </>
  );
}
