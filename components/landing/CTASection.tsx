import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CTASection() {
  const t = useTranslations('landing.cta');

  return (
    <section className="py-16 lg:py-20 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('description')}
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold rounded-xl bg-gradient-growth text-growth-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {t('button')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-5 text-sm text-muted-foreground">
            {t('footer')}
          </p>
        </div>
      </div>
    </section>
  );
}
