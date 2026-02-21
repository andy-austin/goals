import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('privacy');
  return { title: t('title') };
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');

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
        {/* Data Collected */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t('sections.dataCollected.title')}
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--border,#e5e7eb)] p-4">
              <h3 className="font-medium text-foreground mb-2">
                {t('sections.dataCollected.localData.heading')}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t('sections.dataCollected.localData.body')}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border,#e5e7eb)] p-4">
              <h3 className="font-medium text-foreground mb-2">
                {t('sections.dataCollected.analytics.heading')}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t('sections.dataCollected.analytics.body')}
              </p>
            </div>
          </div>
        </section>

        {/* How We Use */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.howWeUse.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.howWeUse.body')}</p>
        </section>

        {/* Data Sharing */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.dataSharing.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.dataSharing.body')}</p>
        </section>

        {/* Retention */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.retention.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.retention.body')}</p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {t('sections.yourRights.title')}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{t('sections.yourRights.body')}</p>
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
