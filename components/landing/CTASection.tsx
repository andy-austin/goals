import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const features = [
  "Unlimited goals",
  "Multi-currency support",
  "Progress tracking",
  "Priority management",
];

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 sm:p-12 lg:p-16 text-primary-foreground">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Start investing with intention
            </h2>
            <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who&apos;ve transformed their savings into purposeful,
              goal-driven wealth building. Your first goal is just a click away.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
                  <Check className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 h-14 px-10 text-lg font-semibold rounded-xl bg-secondary text-secondary-foreground shadow-xl hover:bg-secondary/90 transition-colors"
              >
                Create Your First Goal
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="mt-6 text-sm opacity-70">
              Free to start &bull; No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
