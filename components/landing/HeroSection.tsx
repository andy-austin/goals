'use client';

import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden">
      {/* Background gradient - more visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-growth-light/40 via-transparent to-trust-light/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-trust/10 blur-[100px] rounded-full transform translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-growth/15 blur-[100px] rounded-full transform -translate-x-1/3 translate-y-1/4" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-growth-light text-growth text-sm font-medium mb-6 animate-fade-in border border-growth/20">
              <Target className="w-4 h-4" />
              Intentional investing starts here
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6 animate-fade-in">
              Stop Saving.
              <br />
              <span className="text-gradient-growth">Start Planning.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 animate-fade-in leading-relaxed">
              Define, prioritize, and document your investment goals with purpose.
              Know exactly why you&apos;re investing—and stay the course when markets get volatile.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-base font-semibold rounded-xl bg-gradient-growth text-growth-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
              >
                Start Your First Goal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#methodology"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-base font-semibold rounded-xl border-2 border-border bg-card/50 text-foreground hover:bg-card hover:border-growth/50 transition-all duration-200 whitespace-nowrap"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-growth" />
                <span className="text-sm">Bank-level security</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-growth" />
                <span className="text-sm">12k+ goals created</span>
              </div>
            </div>
          </div>

          {/* Right - Goal card preview */}
          <div className="relative animate-slide-in-right">
            <div className="relative z-10">
              <GoalPreviewCard />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-80 h-80 bg-trust/8 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-growth/12 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function GoalPreviewCard() {
  const targetAmount = 50000;
  const currentAmount = 32500;
  const progress = (currentAmount / targetAmount) * 100;
  const daysRemaining = 847;

  return (
    <div className="bg-card rounded-2xl shadow-2xl border border-border/30 p-6 max-w-md mx-auto animate-float ring-1 ring-black/5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-trust-light text-trust text-xs font-semibold mb-2 border border-trust/20">
            High Priority
          </span>
          <h3 className="text-xl font-bold text-foreground">House Down Payment</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Target: December 2026</p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-growth-light to-growth-light/50 flex items-center justify-center shadow-sm border border-growth/10">
          <span className="text-2xl">🏠</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-foreground">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-growth rounded-full transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-muted/70 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Current</p>
            <p className="text-xl font-bold text-foreground">${currentAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-growth-light/50 border border-growth/20">
            <p className="text-xs text-growth mb-1 font-medium">Target</p>
            <p className="text-xl font-bold text-foreground">${targetAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-growth animate-pulse" />
            <span className="text-sm text-muted-foreground">{daysRemaining} days remaining</span>
          </div>
          <span className="text-sm font-semibold text-growth">On Track</span>
        </div>
      </div>
    </div>
  );
}
