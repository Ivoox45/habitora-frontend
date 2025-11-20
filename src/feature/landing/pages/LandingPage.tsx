import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { CallToActionSection } from "../components/CallToActionSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <LandingNavbar />
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <HeroSection />
        <FeaturesSection />
        <CallToActionSection />
      </main>
    </div>
  );
}
