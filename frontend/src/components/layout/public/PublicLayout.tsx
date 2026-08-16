import { Outlet } from 'react-router-dom';
import { FloatingLanguageSwitcher } from '@/components/layout/public/FloatingLanguageSwitcher';
import { PublicFooter } from '@/components/layout/public/PublicFooter';
import { PublicHeader } from '@/components/layout/public/PublicHeader';
import { PublicTopBar } from '@/components/layout/public/PublicTopBar';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <PublicTopBar />
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <FloatingLanguageSwitcher />
    </div>
  );
}
