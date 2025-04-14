import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect to dashboard if already logged in
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div>
      <LoginForm />
    </div>
  );
}
