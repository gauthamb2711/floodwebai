import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SustainabilitySection from '@/components/landing/SustainabilitySection';
import ContactSection from '@/components/landing/ContactSection';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('light', !next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SustainabilitySection />
      <ContactSection />
    </div>
  );
}
