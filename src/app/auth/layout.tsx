import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Authentication - FindWork',
  description: 'Login, register, or reset your password for your FindWork account',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
