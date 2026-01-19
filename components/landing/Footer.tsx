import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">FinGoal</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/dashboard" className="opacity-80 hover:opacity-100 transition-opacity">Dashboard</Link>
            <Link href="#methodology" className="opacity-80 hover:opacity-100 transition-opacity">Methodology</Link>
            <Link href="#calculator" className="opacity-80 hover:opacity-100 transition-opacity">Calculator</Link>
            <Link href="#features" className="opacity-80 hover:opacity-100 transition-opacity">Features</Link>
          </nav>

          <p className="text-sm opacity-70">
            © {currentYear} FinGoal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
