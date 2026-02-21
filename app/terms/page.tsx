import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('terms');
  return { title: t('title') };
}

export default async function TermsPage() {
  const t = await getTranslations('terms');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← FinGoal
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('lastUpdated')}</p>
        <p className="mt-4 text-foreground/80 leading-relaxed">{t('intro')}</p>
      </div>

      <div className="space-y-8">
        {/* Service Description */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.service.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.service.body')}</p>
        </section>

        {/* Not Financial Advice */}
        <section className="rounded-lg border-l-4 border-[var(--warning,#f59e0b)] bg-[var(--warning,#f59e0b)]/5 pl-4 pr-4 py-4">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.notAdvice.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.notAdvice.body')}</p>
        </section>

        {/* User Responsibilities */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.userResponsibilities.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">
            {t('sections.userResponsibilities.body')}
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.disclaimer.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.disclaimer.body')}</p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.liability.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.liability.body')}</p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.changes.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.changes.body')}</p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.contact.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.contact.body')}</p>
        </section>
      </div>
    </div>
  );
}
