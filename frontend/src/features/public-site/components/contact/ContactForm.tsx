import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppButton, AppInput, AppTextarea, toast } from '@/components/app';
import { useSubmitContactForm } from '@/features/contact/hooks/useContactQueries';
import {
  contactFormSchema,
  type ContactFormValues,
} from '@/features/contact/schemas/contact.schema';
import { getApiErrorMessage, scrollToFirstFormError } from '@/lib/api-errors';

export function ContactForm() {
  const { t } = useTranslation();
  const submitMutation = useSubmitContactForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        await submitMutation.mutateAsync({
          ...values,
          company: values.company?.trim() || undefined,
        });

        toast.success(t('contact.form.success'));
        reset();
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    },
    () => {
      scrollToFirstFormError();
    },
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <AppInput
          label={t('contact.form.fullName')}
          required
          error={errors.name?.message}
          {...register('name')}
        />
        <AppInput
          label={t('contact.form.email')}
          type="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <AppInput
          label={t('contact.form.phone')}
          required
          error={errors.phone?.message}
          {...register('phone')}
        />
        <AppInput
          label={t('contact.form.company')}
          error={errors.company?.message}
          {...register('company')}
        />
      </div>

      <AppTextarea
        label={t('contact.form.message')}
        required
        rows={5}
        error={errors.message?.message}
        {...register('message')}
      />

      <AppButton
        type="submit"
        variant="primary"
        size="lg"
        className="w-full font-semibold sm:w-auto"
        isLoading={isSubmitting || submitMutation.isPending}
      >
        {t('contact.form.submit')}
      </AppButton>
    </form>
  );
}
