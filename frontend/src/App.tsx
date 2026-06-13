import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { router } from '@/routes';

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  );
}
