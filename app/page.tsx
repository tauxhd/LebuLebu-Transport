import HeroSection from "@/components/sections/HeroSection";
import ServicesPreview from "@/components/sections/ServicesPreview";
import WhyUsSection from "@/components/sections/WhyUsSection";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <WhyUsSection />
      <CTABanner />
    </>
  );
}