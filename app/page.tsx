import Hero from "@/components/home/Hero";
import ConstellationSection from "@/components/home/ConstellationSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import SupportFinder from "@/components/home/SupportFinder";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WaitlistCapture from "@/components/home/WaitlistCapture";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ConstellationSection />
      <EcosystemSection />
      <SupportFinder />
      <TestimonialsSection />
      <WaitlistCapture />
    </>
  );
}
