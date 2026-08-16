import type { FieldErrors, FieldValues } from 'react-hook-form';
import { flattenFormErrors } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

type FormErrorSummaryProps<TFieldValues extends FieldValues> = {
  errors: FieldErrors<TFieldValues>;
  className?: string;
};

export function FormErrorSummary<TFieldValues extends FieldValues>({
  errors,
  className,
}: FormErrorSummaryProps<TFieldValues>) {
  const messages = flattenFormErrors(errors);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive',
        className,
      )}
    >
      <p className="font-medium">Please fix the following:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {messages.map((message, index) => (
          <li key={`${message}-${index}`}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
