'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, TrendingUp, Calendar, DollarSign, Target, ChevronDown } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export function GoalCalculator() {
  const t = useTranslations('landing.calculator');
  const locale = useLocale();
  const [targetAmount, setTargetAmount] = useState<string>("50000");
  const [years, setYears] = useState<string>("5");
  const [currency, setCurrency] = useState<string>("USD");
  const [now, setNow] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNow(Date.now());
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const annualReturn = 0.07; // 7% placeholder

  const calculations = useMemo(() => {
    const target = parseFloat(targetAmount) || 0;
    const timeYears = parseFloat(years) || 1;
    const months = timeYears * 12;
    const monthlyRate = annualReturn / 12;

    // Future Value of Annuity formula solved for PMT
    const compoundFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    const monthlySavings = target / compoundFactor;

    const totalContributions = monthlySavings * months;
    const estimatedGrowth = target - totalContributions;

    const targetDate = mounted 
      ? new Date(now + timeYears * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(locale, {
          month: 'long',
          year: 'numeric',
        })
      : '';

    const isoTargetDate = mounted 
      ? new Date(now + timeYears * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : '';

    return {
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      totalContributions: Math.round(totalContributions),
      estimatedGrowth: Math.round(estimatedGrowth),
      targetDate: targetDate ? targetDate.charAt(0).toUpperCase() + targetDate.slice(1) : '',
      isoTargetDate,
    };
  }, [targetAmount, years, locale, now, mounted]);

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    ARS: "ARS ",
    CLP: "CLP ",
    MXN: "MX$",
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbols[currency]}${amount.toLocaleString(locale)}`;
  };

  const createGoalHref = useMemo(() => {
    const params = new URLSearchParams();
    if (targetAmount) params.set('amount', targetAmount);
    if (currency) params.set('currency', currency);
    if (calculations.isoTargetDate) params.set('date', calculations.isoTargetDate);
    return `/create?${params.toString()}`;
  }, [targetAmount, currency, calculations.isoTargetDate]);

  return (
    <section id="calculator" className="py-16 lg:py-20 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-growth-light text-growth text-sm font-semibold mb-4 border border-growth/20">
            <Calculator className="w-4 h-4 inline mr-2" />
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('titlePrefix')}{" "}
            <span className="text-gradient-growth">{t('titleSuffix')}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input card */}
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-growth" />
                {t('inputs.title')}
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium text-foreground">
                    {t('inputs.currency')}
                  </label>
                  <div className="relative">
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-12 pl-3 pr-10 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                    >
                      <option value="USD">🇺🇸 USD - US Dollar</option>
                      <option value="EUR">🇪🇺 EUR - Euro</option>
                      <option value="ARS">🇦🇷 ARS - Argentine Peso</option>
                      <option value="CLP">🇨🇱 CLP - Chilean Peso</option>
                      <option value="MXN">🇲🇽 MXN - Mexican Peso</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="target" className="text-sm font-medium text-foreground">
                    {t('inputs.targetAmount')}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="target"
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className="w-full h-12 pl-10 pr-3 rounded-lg border border-border bg-background text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="50,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="years" className="text-sm font-medium text-foreground">
                    {t('inputs.timeHorizon')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="years"
                      type="number"
                      min="1"
                      max="40"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full h-12 pl-10 pr-3 rounded-lg border border-border bg-background text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {t('inputs.disclaimer')}
                  </p>
                </div>
              </div>
            </div>

            {/* Results card */}
            <div className="bg-gradient-hero rounded-2xl shadow-xl p-6 lg:p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Calculator className="w-5 h-5" />
                {t('results.title')}
              </h3>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-white/15 backdrop-blur">
                  <p className="text-sm text-white/90 mb-1">{t('results.monthlySavings')}</p>
                  <p className="text-4xl lg:text-5xl font-bold text-white">
                    {formatCurrency(calculations.monthlySavings)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/15 backdrop-blur">
                    <p className="text-xs text-white/80 mb-1">{t('results.totalContributions')}</p>
                    <p className="text-xl font-semibold text-white">{formatCurrency(calculations.totalContributions)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/15 backdrop-blur">
                    <p className="text-xs text-white/80 mb-1">{t('results.estimatedGrowth')}</p>
                    <p className="text-xl font-semibold text-green-300">+{formatCurrency(calculations.estimatedGrowth)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-white/20 gap-4 sm:gap-0">
                  <div className="text-left">
                    <p className="text-xs text-white/80">{t('results.targetDate')}</p>
                    <p className="font-medium text-white">{calculations.targetDate}</p>
                  </div>
                  <Link
                    href={createGoalHref}
                    className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-white text-gray-900 font-semibold shadow-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
                  >
                    {t('results.createGoal')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
