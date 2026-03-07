import { Target, DollarSign, Calendar, Globe, Layers, Heart, Shield, TrendingUp, Star, GripVertical, Home, GraduationCap, Palmtree } from 'lucide-react';
import { useTranslations } from 'next-intl';

const stepConfig = [
  { icon: Target, key: "purpose", color: "text-growth", bgColor: "bg-growth-light" },
  { icon: DollarSign, key: "amount", color: "text-trust", bgColor: "bg-trust-light" },
  { icon: Calendar, key: "date", color: "text-growth", bgColor: "bg-growth-light" },
  { icon: Globe, key: "currency", color: "text-trust", bgColor: "bg-trust-light" },
  { icon: Layers, key: "bucket", color: "text-growth", bgColor: "bg-growth-light" },
  { icon: Heart, key: "why", color: "text-trust", bgColor: "bg-trust-light" },
];

const mockGoalsConfig = [
  { id: 1, key: "emergencyFund", icon: Shield, bucket: "safety", amount: "$15,000", progress: 85 },
  { id: 2, key: "houseDownPayment", icon: Home, bucket: "growth", amount: "$50,000", progress: 65 },
  { id: 3, key: "education", icon: GraduationCap, bucket: "growth", amount: "$80,000", progress: 32 },
  { id: 4, key: "vacation", icon: Palmtree, bucket: "dream", amount: "$8,000", progress: 78 },
];

const bucketColors = {
  safety: "border-l-bucket-safety bg-bucket-safety-light",
  growth: "border-l-bucket-growth bg-bucket-growth-light",
  dream: "border-l-bucket-dream bg-bucket-dream-light",
};

const bucketBadges = {
  safety: "bg-bucket-safety-light text-bucket-safety",
  growth: "bg-bucket-growth-light text-bucket-growth",
  dream: "bg-bucket-dream-light text-bucket-dream",
};

export function GoalFrameworkSection() {
  const tMethod = useTranslations('landing.methodology');
  const tPriority = useTranslations('landing.priority');

  return (
    <section id="methodology" className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* SMART Pillars */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-trust-light text-trust text-sm font-semibold mb-4 border border-trust/20">
            {tMethod('badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {tMethod('titlePrefix')}{" "}
            <span className="text-gradient-growth">{tMethod('titleSuffix')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {tMethod('description')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {stepConfig.map((step, index) => (
            <div
              key={step.key}
              className="group relative p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:border-growth/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center mb-4 border border-${step.color.replace('text-', '')}/20 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-muted/80 flex items-center justify-center border border-border/50">
                <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{tMethod(`steps.${step.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{tMethod(`steps.${step.key}.description`)}</p>
            </div>
          ))}
        </div>

        {/* 3 Buckets Method */}
        <div id="features" className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Drag-and-drop mockup */}
          <div className="order-2 lg:order-1 min-w-0">
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6 lg:p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">{tPriority('dragTitle')}</h3>
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{tPriority('dragSubtitle')}</span>
              </div>

              <div className="space-y-2 sm:space-y-3 overflow-hidden">
                {mockGoalsConfig.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl border-l-4 ${bucketColors[goal.bucket as keyof typeof bucketColors]} transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing overflow-hidden`}
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 hidden md:block" />
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-card shadow-sm flex items-center justify-center flex-shrink-0">
                      <goal.icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 overflow-hidden">
                        <h4 className="text-sm sm:text-base font-medium text-foreground truncate">{tPriority(`mockGoals.${goal.key}`)}</h4>
                        <span className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${bucketBadges[goal.bucket as keyof typeof bucketBadges]}`}>
                          {goal.bucket}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden min-w-0">
                          <div className="h-full bg-gradient-growth rounded-full" style={{ width: `${goal.progress}%` }} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0">{goal.progress}%</span>
                        <span className="text-xs sm:text-sm font-semibold text-foreground flex-shrink-0 hidden sm:inline">{goal.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Buckets description */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-2 rounded-full bg-growth-light text-growth text-sm font-medium mb-4">
              {tPriority('badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {tPriority('titlePrefix')}{" "}
              <span className="text-gradient-growth">{tPriority('titleSuffix')}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {tPriority('description')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-bucket-safety-light flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-bucket-safety" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{tPriority('buckets.safety.title')}</h4>
                  <p className="text-sm text-muted-foreground">{tPriority('buckets.safety.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-bucket-growth-light flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-bucket-growth" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{tPriority('buckets.growth.title')}</h4>
                  <p className="text-sm text-muted-foreground">{tPriority('buckets.growth.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-bucket-dream-light flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-bucket-dream" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{tPriority('buckets.dream.title')}</h4>
                  <p className="text-sm text-muted-foreground">{tPriority('buckets.dream.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
