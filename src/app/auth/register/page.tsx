import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { RegisterForm } from '@/components/auth/register-form';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect to dashboard if already logged in
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <RegisterForm />
  );
}
