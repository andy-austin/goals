import { GripVertical, Home, GraduationCap, Palmtree, Car } from 'lucide-react';

const mockGoals = [
  {
    id: 1,
    name: "House Down Payment",
    icon: Home,
    priority: "high",
    amount: "$50,000",
    progress: 65,
  },
  {
    id: 2,
    name: "Kids' Education",
    icon: GraduationCap,
    priority: "high",
    amount: "$80,000",
    progress: 32,
  },
  {
    id: 3,
    name: "Dream Vacation",
    icon: Palmtree,
    priority: "medium",
    amount: "$8,000",
    progress: 78,
  },
  {
    id: 4,
    name: "New Car Fund",
    icon: Car,
    priority: "low",
    amount: "$25,000",
    progress: 15,
  },
];

const priorityColors = {
  high: "border-l-priority-high bg-red-50 dark:bg-red-950/20",
  medium: "border-l-priority-medium bg-amber-50 dark:bg-amber-950/20",
  low: "border-l-priority-low bg-green-50 dark:bg-green-950/20",
};

const priorityBadges = {
  high: "bg-red-100 text-priority-high dark:bg-red-950/50",
  medium: "bg-amber-100 text-priority-medium dark:bg-amber-950/50",
  low: "bg-green-100 text-priority-low dark:bg-green-950/50",
};

export function PriorityFeature() {
  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left - Drag and drop mockup */}
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Your Goals</h3>
                <span className="text-sm text-muted-foreground">Drag to reorder</span>
              </div>

              <div className="space-y-3">
                {mockGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${priorityColors[goal.priority as keyof typeof priorityColors]} transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing`}
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />

                    <div className="w-10 h-10 rounded-lg bg-card shadow-sm flex items-center justify-center flex-shrink-0">
                      <goal.icon className="w-5 h-5 text-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{goal.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityBadges[goal.priority as keyof typeof priorityBadges]}`}>
                          {goal.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-growth rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{goal.progress}%</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">{goal.amount}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Priority order affects resource allocation suggestions
                </p>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-priority-high" />
                  <span className="w-3 h-3 rounded-full bg-priority-medium" />
                  <span className="w-3 h-3 rounded-full bg-priority-low" />
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-2 rounded-full bg-growth-light text-growth text-sm font-medium mb-4">
              Priority Management
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Not all goals are{" "}
              <span className="text-gradient-growth">created equal</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Life is full of trade-offs. When you can&apos;t fund everything at once,
              FinGoal helps you decide what matters most. Drag and drop to set priorities
              and get personalized allocation recommendations.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-priority-high/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-priority-high" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">High Priority</h4>
                  <p className="text-sm text-muted-foreground">Non-negotiable goals that take precedence</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-priority-medium/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-priority-medium" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Medium Priority</h4>
                  <p className="text-sm text-muted-foreground">Important but flexible on timing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-priority-low/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-priority-low" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Low Priority</h4>
                  <p className="text-sm text-muted-foreground">Nice-to-have goals for surplus funds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
