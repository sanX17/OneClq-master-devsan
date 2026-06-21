import Hero from "@/components/hero";
import Features from "@/components/features";
import AnimatedShowcase from "@/components/animated-showcase";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* <AnimatedAppsShowcase /> */}

      {/* Showcase */}
      {/* <AnimatedShowcase /> */}

      {/* Features Section */}
      <Features />
    </div>
  );
}
