'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { AuthLayout } from '@/components/auth';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();
  const t = useTranslations('auth');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    const { error: authError } = await updatePassword(password);
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/auth/login?message=passwordReset');
    }
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{t('resetPasswordTitle')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('resetPasswordSubtitle')}</p>
      </div>

      {error && (
        <div className="rounded-md bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            {t('newPassword')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder={t('passwordPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
            {t('confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder={t('confirmPasswordPlaceholder')}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('resettingPassword') : t('resetPassword')}
        </Button>
      </form>
    </AuthLayout>
  );
}
