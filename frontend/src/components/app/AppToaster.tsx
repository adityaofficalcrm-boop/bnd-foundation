import { Toaster as SonnerToaster } from 'sonner';

export function AppToaster() {
  return (
    <SonnerToaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'border border-border bg-card text-foreground shadow-elevated',
          title: 'text-sm font-medium',
          description: 'text-sm text-muted-foreground',
        },
      }}
    />
  );
}

export { toast } from 'sonner';
