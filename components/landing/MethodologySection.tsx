import { Target, DollarSign, Calendar, Globe, Layers, Heart } from 'lucide-react';

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
    icon: Layers,
    title: "Goal Bucket",
    description: "Categorize into Safety, Growth, or Dream buckets based on urgency and risk.",
    color: "text-growth",
    bgColor: "bg-growth-light",
  },
  {
    icon: Heart,
    title: "Why It Matters",
    description: "Document your emotional anchor—the 'why' that keeps you committed.",
    color: "text-trust",
    bgColor: "bg-trust-light",
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-trust-light text-trust text-sm font-semibold mb-4 border border-trust/20">
            Our Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Six pillars of{" "}
            <span className="text-gradient-growth">intentional investing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every great financial outcome starts with a clear goal. Our structured approach
            ensures you capture every detail needed to succeed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:border-growth/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center mb-4 border border-${step.color.replace('text-', '')}/20 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>

              <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-muted/80 flex items-center justify-center border border-border/50">
                <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Visual flow - hidden on mobile */}
        <div className="mt-10 hidden sm:flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-growth-light text-growth font-semibold border border-growth/20">Purpose</span>
          <span className="text-muted-foreground/60">→</span>
          <span className="px-3 py-1.5 rounded-full bg-trust-light text-trust font-semibold border border-trust/20">Amount</span>
          <span className="text-muted-foreground/60">→</span>
          <span className="px-3 py-1.5 rounded-full bg-growth-light text-growth font-semibold border border-growth/20">Timeline</span>
          <span className="text-muted-foreground/60">→</span>
          <span className="px-3 py-1.5 rounded-full bg-trust-light text-trust font-semibold border border-trust/20">Currency</span>
          <span className="text-muted-foreground/60">→</span>
          <span className="px-3 py-1.5 rounded-full bg-growth-light text-growth font-semibold border border-growth/20">Bucket</span>
          <span className="text-muted-foreground/60">→</span>
          <span className="px-3 py-1.5 rounded-full bg-trust-light text-trust font-semibold border border-trust/20">Why</span>
        </div>
      </div>
    </section>
  );
}
