import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppButton } from '@/components/app/AppButton';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { SidebarBrand, SidebarNav } from '@/components/layout/SidebarNav';
import { TopBar } from '@/components/layout/TopBar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAdminBreadcrumbs } from '@/hooks/useAdminBreadcrumbs';

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const breadcrumbs = useAdminBreadcrumbs();

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <TopBar
            breadcrumbs={breadcrumbs}
            mobileTrigger={
              <SheetTrigger asChild>
                <AppButton variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <MenuIcon className="size-4" />
                </AppButton>
              </SheetTrigger>
            }
          />
          <SheetContent
            side="left"
            className="w-[var(--width-sidebar)] p-0 lg:hidden"
            title="Admin navigation"
            description="Admin panel sidebar navigation"
          >
            <SidebarBrand />
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[var(--width-content-max)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
