import { GripVertical, Home, GraduationCap, Palmtree, Shield, TrendingUp, Star, Briefcase } from 'lucide-react';

const mockGoals = [
  {
    id: 1,
    name: "Emergency Fund",
    icon: Shield,
    bucket: "safety",
    amount: "$15,000",
    progress: 85,
  },
  {
    id: 2,
    name: "House Down Payment",
    icon: Home,
    bucket: "growth",
    amount: "$50,000",
    progress: 65,
  },
  {
    id: 3,
    name: "Kids' Education",
    icon: GraduationCap,
    bucket: "growth",
    amount: "$80,000",
    progress: 32,
  },
  {
    id: 4,
    name: "Dream Vacation",
    icon: Palmtree,
    bucket: "dream",
    amount: "$8,000",
    progress: 78,
  },
];

const bucketColors = {
  safety: "border-l-green-500 bg-green-50 dark:bg-green-950/20",
  growth: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20",
  dream: "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20",
};

const bucketBadges = {
  safety: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
  growth: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  dream: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
};

const bucketDots = {
  safety: "bg-green-500",
  growth: "bg-blue-500",
  dream: "bg-purple-500",
};

export function PriorityFeature() {
  return (
    <section className="py-16 lg:py-20 bg-muted/30 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left - Drag and drop mockup */}
          <div className="order-2 lg:order-1 min-w-0">
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6 lg:p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Your Goals</h3>
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Drag to reorder</span>
              </div>

              <div className="space-y-2 sm:space-y-3 overflow-hidden">
                {mockGoals.map((goal) => (
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
                        <h4 className="text-sm sm:text-base font-medium text-foreground truncate">{goal.name}</h4>
                        <span className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${bucketBadges[goal.bucket as keyof typeof bucketBadges]}`}>
                          {goal.bucket}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden min-w-0">
                          <div
                            className="h-full bg-gradient-growth rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0">{goal.progress}%</span>
                        <span className="text-xs sm:text-sm font-semibold text-foreground flex-shrink-0 hidden sm:inline">{goal.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Organize by bucket type
                </p>
                <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                  <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${bucketDots.safety}`} />
                  <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${bucketDots.growth}`} />
                  <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${bucketDots.dream}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-2 rounded-full bg-growth-light text-growth text-sm font-medium mb-4">
              The 3 Buckets Method
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Organize goals by{" "}
              <span className="text-gradient-growth">purpose</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Not all goals are created equal. The 3 Buckets methodology helps you categorize
              and prioritize based on urgency and risk tolerance. Drag and drop to set your order
              within each bucket.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Safety Bucket</h4>
                  <p className="text-sm text-muted-foreground">Non-negotiable, urgent goals like emergency funds and health expenses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Growth Bucket</h4>
                  <p className="text-sm text-muted-foreground">Goals that improve your standard of living—house, education, car</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Dream Bucket</h4>
                  <p className="text-sm text-muted-foreground">Aspirational goals you can afford to take risks on—travel, business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
