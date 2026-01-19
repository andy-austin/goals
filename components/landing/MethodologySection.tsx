import { Target, DollarSign, Calendar, Globe, BarChart3, Gauge } from 'lucide-react';

const steps = [
  {
    icon: Target,
    title: "Goal Purpose",
    description: "Define what the money is for—retirement, a home, education, or a dream vacation.",
    color: "text-growth",
    bgColor: "bg-growth-light",
  },
  {
    icon: DollarSign,
    title: "Target Amount",
    description: "Set a specific, measurable number. Know exactly how much you need.",
    color: "text-trust",
    bgColor: "bg-trust-light",
  },
  {
    icon: Calendar,
    title: "Target Date",
    description: "Establish your time horizon. When do you need this money?",
    color: "text-growth",
    bgColor: "bg-growth-light",
  },
  {
    icon: Globe,
    title: "Currency",
    description: "Multi-currency support for USD, EUR, and local currencies (ARS/CLP/MXN).",
    color: "text-trust",
    bgColor: "bg-trust-light",
  },
  {
    icon: BarChart3,
    title: "Priority Level",
    description: "Rank your goals to handle trade-offs when resources are limited.",
    color: "text-growth",
    bgColor: "bg-growth-light",
  },
  {
    icon: Gauge,
    title: "Risk Tolerance",
    description: "Assess your comfort level—from conservative to aggressive—for each goal.",
    color: "text-trust",
    bgColor: "bg-trust-light",
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-trust-light text-trust text-sm font-medium mb-4">
            Our Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Six pillars of{" "}
            <span className="text-gradient-growth">intentional investing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every great financial outcome starts with a clear goal. Our structured approach
            ensures you capture every detail needed to succeed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative p-6 lg:p-8 bg-card rounded-2xl border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center mb-5`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>

              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">{index + 1}</span>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Visual flow */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="px-4 py-2 rounded-lg bg-growth-light text-growth font-medium">Purpose</span>
          <span className="text-muted-foreground">→</span>
          <span className="px-4 py-2 rounded-lg bg-trust-light text-trust font-medium">Amount</span>
          <span className="text-muted-foreground">→</span>
          <span className="px-4 py-2 rounded-lg bg-growth-light text-growth font-medium">Time</span>
          <span className="text-muted-foreground">→</span>
          <span className="px-4 py-2 rounded-lg bg-trust-light text-trust font-medium">Currency</span>
          <span className="text-muted-foreground">→</span>
          <span className="px-4 py-2 rounded-lg bg-growth-light text-growth font-medium">Priority</span>
          <span className="text-muted-foreground">→</span>
          <span className="px-4 py-2 rounded-lg bg-trust-light text-trust font-medium">Risk</span>
        </div>
      </div>
    </section>
  );
}
