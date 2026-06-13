import { HeartHandshakeIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';

function formatRole(role: string): string {
  return role.replace('_', ' ');
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName ?? 'Admin'}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          This is your admin foundation workspace. Content, campaigns, donations, and team modules
          will be added in upcoming phases.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Signed in as</CardDescription>
              <UsersIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="text-xl">
              {user?.firstName} {user?.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Access level</CardDescription>
              <ShieldCheckIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="text-xl">{user ? formatRole(user.role) : '—'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Role-based navigation and route protection are active.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Organization</CardDescription>
              <HeartHandshakeIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="text-xl">BND Foundation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Admin panel foundation is ready for CMS, campaigns, and donation modules.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
