import { zodResolver } from '@hookform/resolvers/zod';
import { HeartHandshakeIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppButton, AppInput } from '@/components/app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';
import { env } from '@/config/env';
import { flattenFormErrors, scrollToFirstFormError } from '@/lib/api-errors';
import { toast } from '@/components/app';

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

  const onSubmit = handleSubmit(
    async (values) => {
      setError(null);

      try {
        await login(values.email, values.password);
        toast.success('Signed in successfully.');
        navigate(redirectTo, { replace: true });
      } catch {
        const message = 'Invalid email or password. Please try again.';
        setError(message);
        toast.error(message);
      }
    },
    (formErrors) => {
      const messages = flattenFormErrors(formErrors);
      toast.error(messages[0] ?? 'Please enter your email and password.');
      scrollToFirstFormError();
    },
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="hidden flex-1 flex-col justify-between border-r bg-surface p-10 lg:flex">
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

      <div className="flex flex-1 items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md border shadow-elevated">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary lg:hidden">
              <HeartHandshakeIcon className="size-5" />
              <span className="font-semibold">{env.VITE_APP_NAME}</span>
            </div>
            <CardTitle className="text-2xl">Admin Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => void onSubmit(event)} className="space-y-4" noValidate>
              <AppInput
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="admin@bndfoundation.org"
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <AppInput
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password?.message}
                required
                {...register('password')}
              />

              {error ? (
                <div
                  className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </div>
              ) : null}

              <AppButton type="submit" className="w-full" isLoading={isSubmitting}>
                Sign in
              </AppButton>
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
