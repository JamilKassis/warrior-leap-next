import type { Metadata } from 'next';
import LoginClient from '@/components/auth/login-client';

export const metadata: Metadata = {
  title: 'Admin Login | Warrior Leap',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
