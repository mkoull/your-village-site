import VillageHero from "@/components/home/VillageHero";
import RestSection from "@/components/home/RestSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import NotATodoSection from "@/components/home/NotATodoSection";
import TrustSection from "@/components/home/TrustSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SupportFinder from "@/components/home/SupportFinder";
import WaitlistCapture from "@/components/home/WaitlistCapture";

export default function HomePage() {
  return (
    <>
      <VillageHero />
      <RestSection />
      <EcosystemSection />
      <NotATodoSection />
      <TrustSection />
      <StatsSection />
      <TestimonialsSection />
      <SupportFinder />
      <WaitlistCapture />
    </>
  );
}
