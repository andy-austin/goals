import { Brain, Shield, TrendingDown, CheckCircle2 } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: "Clarity defeats panic",
    description: "Written goals create psychological commitment. When markets drop 20%, you'll remember why you're investing—not just that you're losing money.",
  },
  {
    icon: Shield,
    title: "Defense against FOMO",
    description: "Documented priorities protect you from chasing hot stocks or crypto pumps that don't align with your actual life goals.",
  },
  {
    icon: TrendingDown,
    title: "Stay the course",
    description: "Studies show investors who write down their goals are 42% more likely to stay invested during market volatility.",
  },
];

export function WhyDocumentSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-growth/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-trust/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-trust-light text-trust text-sm font-medium mb-4">
              The Science Behind It
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why writing down goals{" "}
              <span className="text-gradient-hero">actually works</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Behavioral finance research shows that investors who document their goals make
              fewer emotional decisions and achieve better long-term returns.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-growth-light flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-growth" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Quote card */}
          <div className="relative">
            <div className="bg-gradient-hero rounded-2xl p-8 lg:p-10 text-primary-foreground shadow-xl">
              <div className="text-6xl leading-none opacity-30 mb-4">&ldquo;</div>
              <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed mb-6">
                The biggest risk in investing isn&apos;t volatility—it&apos;s selling at the wrong time
                because you forgot why you started.
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-lg font-bold">FG</span>
                </div>
                <div>
                  <p className="font-semibold">FinGoal Team</p>
                  <p className="text-sm opacity-80">Built for intentional investors</p>
                </div>
              </div>
            </div>

            {/* Stats floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-xl border border-border/50 p-5 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-8 h-8 text-growth" />
                <span className="text-2xl font-bold text-foreground">42%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                More likely to stay invested during volatility when goals are documented
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
