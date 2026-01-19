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
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 sm:p-10 lg:p-12 text-primary-foreground shadow-2xl ring-1 ring-black/10">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Start investing with intention
            </h2>
            <p className="text-base sm:text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Join thousands of investors who&apos;ve transformed their savings into purposeful,
              goal-driven wealth building. Your first goal is just a click away.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10">
                  <Check className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold rounded-xl bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Create Your First Goal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="mt-5 text-sm opacity-70">
              Free to start &bull; No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
