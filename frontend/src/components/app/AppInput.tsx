import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AppInputProps = React.ComponentProps<'input'> & {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
};

function AppInput({
  id,
  label,
  helperText,
  error,
  className,
  containerClassName,
  required,
  ...props
}: AppInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label ? (
        <Label htmlFor={inputId}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <Input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        className={cn('min-h-10', error && 'border-destructive focus-visible:ring-destructive/30', className)}
        {...props}
      />
      {helperText && !error ? (
        <p id={helperId} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { AppInput };
