import * as React from 'react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type AppTextareaProps = React.ComponentProps<'textarea'> & {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
};

function AppTextarea({
  id,
  label,
  helperText,
  error,
  className,
  containerClassName,
  required,
  ...props
}: AppTextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label ? (
        <Label htmlFor={textareaId}>
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <Textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        className={cn(error && 'border-destructive focus-visible:ring-destructive/30', className)}
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

export { AppTextarea };
