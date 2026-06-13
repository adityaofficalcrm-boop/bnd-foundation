import { NavLink } from 'react-router-dom';
import { adminNavItems } from '@/config/admin-nav';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';
import { env } from '@/config/env';

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { hasRole } = useAuth();

  const visibleItems = adminNavItems.filter((item) => hasRole(...item.roles));

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {visibleItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === '/admin'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )
          }
        >
          <item.icon className="size-4 shrink-0" />
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="border-b px-6 py-5">
      <p className="text-xs font-semibold tracking-wider text-primary uppercase">Admin Panel</p>
      <h2 className="mt-1 text-lg font-bold text-foreground">{env.VITE_APP_NAME}</h2>
      <p className="text-xs text-muted-foreground">Non-profit management</p>
    </div>
  );
}
