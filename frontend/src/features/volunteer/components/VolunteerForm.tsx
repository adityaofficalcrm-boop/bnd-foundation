import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppButton, AppInput, AppSelect, AppTextarea, toast } from '@/components/app';
import { useSubmitVolunteerApplication } from '@/features/volunteer/hooks/useVolunteerQueries';
import {
  volunteerFormSchema,
  type VolunteerFormValues,
} from '@/features/volunteer/schemas/volunteer.schema';
import { VOLUNTEER_INTEREST_OPTIONS } from '@/features/volunteer/types/volunteer.types';
import { getApiErrorMessage, scrollToFirstFormError } from '@/lib/api-errors';

export function VolunteerForm() {
  const { t } = useTranslation();
  const submitMutation = useSubmitVolunteerApplication();

  const interestOptions = VOLUNTEER_INTEREST_OPTIONS.map((value) => ({
    value,
    label: t(`volunteer.interestOptions.${value}`, { defaultValue: value }),
  }));

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      interests: VOLUNTEER_INTEREST_OPTIONS[0],
      availability: '',
      message: '',
    },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        await submitMutation.mutateAsync({
          ...values,
          city: values.city?.trim() || undefined,
          country: values.country?.trim() || undefined,
          availability: values.availability?.trim() || undefined,
        });

        toast.success(t('volunteer.success'));
        reset({
          fullName: '',
          email: '',
          phone: '',
          city: '',
          country: '',
          interests: VOLUNTEER_INTEREST_OPTIONS[0],
          availability: '',
          message: '',
        });
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
          label={t('volunteer.fullName')}
          required
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <AppInput
          label={t('volunteer.email')}
          type="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <AppInput
          label={t('volunteer.phone')}
          required
          error={errors.phone?.message}
          {...register('phone')}
        />
        <AppInput label={t('volunteer.city')} error={errors.city?.message} {...register('city')} />
        <AppInput
          label={t('volunteer.country')}
          error={errors.country?.message}
          {...register('country')}
        />
        <Controller
          name="interests"
          control={control}
          render={({ field }) => (
            <AppSelect
              label={t('volunteer.interests')}
              options={interestOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.interests?.message}
            />
          )}
        />
      </div>

      <AppInput
        label={t('volunteer.availability')}
        placeholder={t('volunteer.availabilityPlaceholder')}
        error={errors.availability?.message}
        {...register('availability')}
      />

      <AppTextarea
        label={t('volunteer.message')}
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
        {t('volunteer.submit')}
      </AppButton>
    </form>
  );
}
