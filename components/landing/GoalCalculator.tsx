'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calculator, TrendingUp, Calendar, DollarSign, Target } from 'lucide-react';

export function GoalCalculator() {
  const [targetAmount, setTargetAmount] = useState<string>("50000");
  const [years, setYears] = useState<string>("5");
  const [currency, setCurrency] = useState<string>("USD");

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

    return {
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      totalContributions: Math.round(totalContributions),
      estimatedGrowth: Math.round(estimatedGrowth),
      targetDate: new Date(Date.now() + timeYears * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    };
  }, [targetAmount, years]);

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    ARS: "ARS ",
    CLP: "CLP ",
    MXN: "MX$",
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbols[currency]}${amount.toLocaleString()}`;
  };

  return (
    <section id="calculator" className="py-16 lg:py-20 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-growth-light text-growth text-sm font-semibold mb-4 border border-growth/20">
            <Calculator className="w-4 h-4 inline mr-2" />
            Goal Calculator
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            See your path to{" "}
            <span className="text-gradient-growth">any goal</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enter your target and timeframe. We&apos;ll calculate exactly how much you need to save monthly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input card */}
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-growth" />
                Your Goal Details
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium text-foreground">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-12 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="USD">🇺🇸 USD - US Dollar</option>
                    <option value="EUR">🇪🇺 EUR - Euro</option>
                    <option value="ARS">🇦🇷 ARS - Argentine Peso</option>
                    <option value="CLP">🇨🇱 CLP - Chilean Peso</option>
                    <option value="MXN">🇲🇽 MXN - Mexican Peso</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="target" className="text-sm font-medium text-foreground">
                    Target Amount
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
                    Time Horizon (Years)
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
                    Calculation assumes 7% annual return (historical market average)
                  </p>
                </div>
              </div>
            </div>

            {/* Results card */}
            <div className="bg-gradient-hero rounded-2xl shadow-xl p-6 lg:p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Calculator className="w-5 h-5" />
                Your Savings Plan
              </h3>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-white/15 backdrop-blur">
                  <p className="text-sm text-white/90 mb-1">Monthly Savings Required</p>
                  <p className="text-4xl lg:text-5xl font-bold text-white">
                    {formatCurrency(calculations.monthlySavings)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/15 backdrop-blur">
                    <p className="text-xs text-white/80 mb-1">Total Contributions</p>
                    <p className="text-xl font-semibold text-white">{formatCurrency(calculations.totalContributions)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/15 backdrop-blur">
                    <p className="text-xs text-white/80 mb-1">Estimated Growth</p>
                    <p className="text-xl font-semibold text-green-300">+{formatCurrency(calculations.estimatedGrowth)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div>
                    <p className="text-xs text-white/80">Target Date</p>
                    <p className="font-medium text-white">{calculations.targetDate}</p>
                  </div>
                  <Link
                    href="/create"
                    className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-white text-gray-900 font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    Create This Goal
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
