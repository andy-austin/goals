import {
  LandingHeader,
  HeroSection,
  GoalFrameworkSection,
  GoalCalculator,
  CTASection,
  Footer,
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <GoalFrameworkSection />
        <GoalCalculator />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
