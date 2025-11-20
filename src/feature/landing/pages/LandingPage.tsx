// src/feature/landing/pages/LandingPage.tsx

import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { CallToActionSection } from "../components/CallToActionSection";

export default function LandingPage() {
  return (
    
      <div className="min-h-screen bg-background text-foreground">
        
        {/* Navbar */}
        <LandingNavbar />

        {/* Contenido principal */}
        <main className="max-w-6xl mx-auto px-4 pb-16">
          <HeroSection />
          <FeaturesSection />
          <CallToActionSection />
        </main>

      </div>
  );
}
