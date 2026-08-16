import axios from 'axios';
import type { FieldErrors, FieldValues } from 'react-hook-form';

type ApiFieldError = {
  field?: string;
  message?: string;
};

type ApiErrorBody = {
  success?: false;
  message?: string;
  errors?: ApiFieldError[] | string;
};

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data as ApiErrorBody | undefined;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const messages = data.errors
      .map((entry) => entry.message)
      .filter((message): message is string => Boolean(message));

    if (messages.length === 1) {
      return messages[0];
    }

    if (messages.length > 1) {
      return `${data.message ?? fallback}: ${messages.join(', ')}`;
    }
  }

  if (typeof data?.errors === 'string' && data.errors.trim()) {
    return data.errors;
  }

  return data?.message ?? fallback;
}

export function flattenFormErrors<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string[] {
  const messages: string[] = [];

  for (const value of Object.values(errors)) {
    if (!value) {
      continue;
    }

    if (typeof value === 'object' && value !== null && 'message' in value && typeof value.message === 'string') {
      messages.push(value.message);
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      messages.push(...flattenFormErrors(value as FieldErrors<TFieldValues>));
    }
  }

  return messages;
}

export function scrollToFirstFormError(): void {
  const invalidField = document.querySelector<HTMLElement>('[aria-invalid="true"]');

  if (invalidField) {
    invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalidField.focus({ preventScroll: true });
  }
}
