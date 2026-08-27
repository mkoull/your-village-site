import Hero from "@/components/home/Hero";
import ConstellationSection from "@/components/home/ConstellationSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import EcosystemSection from "@/components/home/EcosystemSection";
import TrustSection from "@/components/home/TrustSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WaitlistCapture from "@/components/home/WaitlistCapture";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ConstellationSection />
      <ServicesPreview />
      <EcosystemSection />
      <TrustSection />
      <TestimonialsSection />
      <WaitlistCapture />
    </>
  );
}
