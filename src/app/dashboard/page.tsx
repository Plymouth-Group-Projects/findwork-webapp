import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Protect the dashboard page
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.name}</h2>
        <p>You are now logged in as {session.user.email}</p>
      </div>
    </div>
  );
}
