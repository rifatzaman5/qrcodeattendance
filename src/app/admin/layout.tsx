import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" name={session.name} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
