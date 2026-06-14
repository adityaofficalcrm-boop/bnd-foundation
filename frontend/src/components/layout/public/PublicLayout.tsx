import { Outlet } from 'react-router-dom';
import { PublicFooter } from '@/components/layout/public/PublicFooter';
import { PublicHeader } from '@/components/layout/public/PublicHeader';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
