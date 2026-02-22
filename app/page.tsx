import Hero from "@/components/home/Hero";
import EcosystemSection from "@/components/home/EcosystemSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SupportFinder from "@/components/home/SupportFinder";
import WaitlistCapture from "@/components/home/WaitlistCapture";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EcosystemSection />
      <ServicesPreview />
      <TestimonialsSection />
      <SupportFinder />
      <WaitlistCapture />
    </>
  );
}
