'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { AuthLayout } from '@/components/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const t = useTranslations('auth');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await resetPassword(email);
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{t('forgotPasswordTitle')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('forgotPasswordSubtitle')}</p>
      </div>

      {error && (
        <div className="rounded-md bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {success ? (
        <div className="rounded-md bg-success/10 p-3 text-sm text-success">
          {t('resetLinkSent', { email })}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('sendingResetLink') : t('sendResetLink')}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          {t('backToLogin')}
        </Link>
      </p>
    </AuthLayout>
  );
}
