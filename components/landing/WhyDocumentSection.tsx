import { Brain, Shield, TrendingDown, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const benefitsConfig = [
  {
    icon: Brain,
    key: "clarity",
  },
  {
    icon: Shield,
    key: "fomo",
  },
  {
    icon: TrendingDown,
    key: "persistence",
  },
];

export function WhyDocumentSection() {
  const t = useTranslations('landing.whyDocument');

  return (
    <section id="features" className="py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-growth/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-trust/8 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-trust-light text-trust text-sm font-medium mb-4">
              {t('badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {t('titlePrefix')}{" "}
              <span className="text-gradient-hero">{t('titleSuffix')}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('description')}
            </p>

            <div className="space-y-5">
              {benefitsConfig.map((benefit) => (
                <div key={benefit.key} className="group flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-growth-light flex items-center justify-center border border-growth/20 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-growth" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{t(`benefits.${benefit.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`benefits.${benefit.key}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Quote card */}
          <div className="lg:ml-4">
            <div className="bg-gradient-hero rounded-2xl p-6 lg:p-8 shadow-2xl ring-1 ring-black/10">
              <div className="text-5xl leading-none text-white/40 mb-3">&ldquo;</div>
              <blockquote className="text-lg lg:text-xl font-medium leading-relaxed mb-5 text-white">
                {t('quote')}
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-base font-bold text-white">FG</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{t('team')}</p>
                  <p className="text-xs text-white/80">{t('teamRole')}</p>
                </div>
              </div>
            </div>

            {/* Stats card - below quote */}
            <div className="mt-4 bg-card rounded-xl shadow-xl border border-border/50 p-4 sm:max-w-[280px] ring-1 ring-black/5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-7 h-7 text-growth" />
                <span className="text-2xl font-bold text-foreground">42%</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('statDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
