import { SidebarBrand, SidebarNav } from '@/components/layout/SidebarNav';

export function AdminSidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
      <SidebarBrand />
      <SidebarNav />
    </aside>
  );
}
