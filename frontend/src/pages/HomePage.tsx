import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export function HomePage() {
  const { data, isLoading, isError, refetch } = useHealthCheck();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="max-w-xl space-y-3 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Public Site</p>
        <h1 className="text-4xl font-bold tracking-tight">{env.VITE_APP_NAME}</h1>
        <p className="text-muted-foreground">
          Public website pages will be built in a future phase. The admin panel is available at{' '}
          <Link to="/login" className="text-primary hover:underline">
            /login
          </Link>
          .
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <p className="mb-2 text-sm font-medium">API Health Check</p>
        {isLoading && <p className="text-sm text-muted-foreground">Connecting to backend...</p>}
        {isError && (
          <p className="text-sm text-destructive">
            Backend unavailable. Start the API with{' '}
            <code className="rounded bg-muted px-1 py-0.5">npm run dev:backend</code>.
          </p>
        )}
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.service} v{data.version} — {data.status} (DB: {data.database.state})
          </p>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
          <Button asChild size="sm">
            <Link to="/login">Admin Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
