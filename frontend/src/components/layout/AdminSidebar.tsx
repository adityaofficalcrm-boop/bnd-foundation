import { SidebarBrand, SidebarCollapseToggle, SidebarNav } from '@/components/layout/SidebarNav';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggleCollapse }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        'hidden h-screen shrink-0 flex-col border-r border-border/80 bg-sidebar shadow-sm transition-[width] duration-200 lg:sticky lg:top-0 lg:flex',
        collapsed ? 'w-[72px]' : 'w-[var(--width-sidebar)]',
      )}
    >
      <SidebarBrand collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      {onToggleCollapse ? (
        <SidebarCollapseToggle collapsed={collapsed} onToggle={onToggleCollapse} />
      ) : null}
    </aside>
  );
}
