'use client';

import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-trust-light/30 blur-3xl rounded-full transform translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-growth-light/40 blur-3xl rounded-full transform -translate-x-1/2" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-growth-light text-growth text-sm font-medium mb-6 animate-fade-in">
              <Target className="w-4 h-4" />
              Intentional investing starts here
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
              Stop Saving.
              <br />
              <span className="text-gradient-growth">Start Planning.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in">
              Define, prioritize, and document your investment goals with purpose.
              Know exactly why you&apos;re investing—and stay the course when markets get volatile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 h-14 px-10 text-lg font-semibold rounded-xl bg-gradient-growth text-growth-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Start Your First Goal
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#methodology"
                className="inline-flex items-center justify-center gap-2 h-14 px-10 text-lg font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-growth" />
                <span className="text-sm">Bank-level security</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-5 h-5 text-growth" />
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
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-trust/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-growth/10 rounded-full blur-2xl" />
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
    <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 max-w-md mx-auto animate-float">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-trust-light text-trust text-xs font-medium mb-2">
            High Priority
          </span>
          <h3 className="text-xl font-semibold text-foreground">House Down Payment</h3>
          <p className="text-sm text-muted-foreground">Target: December 2026</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-growth-light flex items-center justify-center">
          <span className="text-2xl">🏠</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-growth rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-lg font-bold text-foreground">${currentAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Target</p>
            <p className="text-lg font-bold text-foreground">${targetAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-growth animate-pulse" />
            <span className="text-sm text-muted-foreground">{daysRemaining} days remaining</span>
          </div>
          <span className="text-sm font-medium text-growth">On Track</span>
        </div>
      </div>
    </div>
  );
}
