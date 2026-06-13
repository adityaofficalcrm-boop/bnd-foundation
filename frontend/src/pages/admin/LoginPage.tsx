import { zodResolver } from '@hookform/resolvers/zod';
import { HeartHandshakeIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';
import { env } from '@/config/env';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);

    try {
      await login(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="hidden flex-1 flex-col justify-between border-r bg-primary/5 p-10 lg:flex">
        <div className="flex items-center gap-3 text-primary">
          <HeartHandshakeIcon className="size-8" />
          <span className="text-lg font-semibold">{env.VITE_APP_NAME}</span>
        </div>
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage your foundation with clarity and care.
          </h1>
          <p className="text-muted-foreground">
            Secure admin access for BND Foundation staff. Manage content, campaigns, and impact from
            one dedicated workspace.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Authorized personnel only. No public registration.</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md border shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary lg:hidden">
              <HeartHandshakeIcon className="size-5" />
              <span className="font-semibold">{env.VITE_APP_NAME}</span>
            </div>
            <CardTitle className="text-2xl">Admin Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@bndfoundation.org"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                Back to public site
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
