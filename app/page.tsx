import Hero from "@/components/home/Hero";
import RestSection from "@/components/home/RestSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import NotATodoSection from "@/components/home/NotATodoSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import TrustSection from "@/components/home/TrustSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SupportFinder from "@/components/home/SupportFinder";
import WaitlistCapture from "@/components/home/WaitlistCapture";

export default function HomePage() {
  return (
    <>
      <Hero />
      <RestSection />
      <EcosystemSection />
      <NotATodoSection />
      <ServicesPreview />
      <TrustSection />
      <StatsSection />
      <TestimonialsSection />
      <SupportFinder />
      <WaitlistCapture />
    </>
  );
}
