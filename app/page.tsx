import {
  LandingHeader,
  HeroSection,
  MethodologySection,
  GoalCalculator,
  WhyDocumentSection,
  PriorityFeature,
  CTASection,
  Footer,
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <MethodologySection />
        <GoalCalculator />
        <WhyDocumentSection />
        <PriorityFeature />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
