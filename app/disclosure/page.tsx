import { useTranslations } from 'next-intl';

export default function DisclosurePage() {
  const t = useTranslations('disclosure');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">{t('pageTitle')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('lastUpdated')}</p>

      <div className="mt-8 space-y-8 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">{t('sections.howWeMakeMoney.title')}</h2>
          <p className="mt-2 text-muted-foreground">{t('sections.howWeMakeMoney.body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t('sections.commitment.title')}</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1 text-muted-foreground">
            <li>{t('sections.commitment.item1')}</li>
            <li>{t('sections.commitment.item2')}</li>
            <li>{t('sections.commitment.item3')}</li>
            <li>{t('sections.commitment.item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t('sections.whichLinks.title')}</h2>
          <p className="mt-2 text-muted-foreground">{t('sections.whichLinks.body')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t('sections.contact.title')}</h2>
          <p className="mt-2 text-muted-foreground">{t('sections.contact.body')}</p>
        </section>
      </div>
    </div>
  );
}
