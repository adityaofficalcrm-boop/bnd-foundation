import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRightIcon, CreditCardIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppButton, AppInput, toast } from '@/components/app';
import { DonateAmountPicker } from '@/features/donation/components/DonateAmountPicker';
import { DonateFormCard } from '@/features/donation/components/DonateFormCard';
import { DonateSecureNote } from '@/features/donation/components/DonateSecureNote';
import { useSubmitDonationForm } from '@/features/donation/hooks/useDonationQueries';
import {
  donateFormSchema,
  type DonateFormValues,
} from '@/features/donation/schemas/donation.schema';
import { DONATION_PRESET_AMOUNTS } from '@/features/donation/types/donation.types';
import { formatAud } from '@/lib/currency';
import { getApiErrorMessage, scrollToFirstFormError } from '@/lib/api-errors';

type DonateStep = 'amount' | 'donor' | 'payment';

function buildDonorName(firstName: string, lastName?: string) {
  return [firstName.trim(), lastName?.trim()].filter(Boolean).join(' ');
}

export function DonateForm() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const campaignSlug = searchParams.get('campaign')?.trim() || undefined;
  const [step, setStep] = useState<DonateStep>('amount');
  const submitMutation = useSubmitDonationForm();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<DonateFormValues>({
    resolver: zodResolver(donateFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      amount: DONATION_PRESET_AMOUNTS[0],
    },
  });

  const goToDonorStep = async () => {
    const valid = await trigger('amount');
    if (valid) setStep('donor');
  };

  const goToPaymentStep = async () => {
    const valid = await trigger(['firstName', 'lastName', 'email']);
    if (valid) setStep('payment');
  };

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        const result = await submitMutation.mutateAsync({
          donorName: buildDonorName(values.firstName, values.lastName),
          email: values.email,
          amount: values.amount,
          campaignSlug,
        });

        window.location.assign(result.checkoutUrl);
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    },
    () => {
      scrollToFirstFormError();
    },
  );

  if (step === 'amount') {
    return (
      <DonateFormCard step={1}>
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {t('donate.amountTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('donate.amountSubtitle')}</p>
        </div>

        <div className="space-y-6">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <DonateAmountPicker
                value={field.value}
                onChange={field.onChange}
                error={errors.amount?.message}
              />
            )}
          />

          <div className="space-y-3">
            <AppButton
              type="button"
              variant="accent"
              size="lg"
              className="w-full font-semibold"
              onClick={() => void goToDonorStep()}
            >
              {t('donate.donateNow')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </AppButton>
            <DonateSecureNote />
          </div>
        </div>
      </DonateFormCard>
    );
  }

  if (step === 'donor') {
    return (
      <DonateFormCard
        step={2}
        title={t('donate.donorTitle')}
        subtitle={t('donate.donorSubtitle')}
        onBack={() => setStep('amount')}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AppInput
              label={t('donate.firstName')}
              required
              placeholder={t('donate.firstNamePlaceholder')}
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <AppInput
              label={t('donate.lastName')}
              placeholder={t('donate.lastNamePlaceholder')}
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <AppInput
            label={t('donate.email')}
            type="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-3 pt-2">
            <AppButton
              type="button"
              variant="accent"
              size="lg"
              className="w-full font-semibold"
              onClick={() => void goToPaymentStep()}
            >
              {t('cta.continue')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </AppButton>
            <DonateSecureNote />
          </div>
        </div>
      </DonateFormCard>
    );
  }

  const amount = getValues('amount');

  return (
    <DonateFormCard
      step={3}
      title={t('donate.paymentTitle')}
      subtitle={t('donate.paymentSubtitle')}
      onBack={() => setStep('donor')}
    >
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold text-foreground">{t('donate.summary')}</h3>
          </div>
          <dl className="divide-y divide-border text-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="text-muted-foreground">{t('donate.paymentAmount')}</dt>
              <dd className="font-medium text-foreground">{formatAud(amount)}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="text-muted-foreground">{t('donate.givingFrequency')}</dt>
              <dd className="font-medium text-foreground">{t('donate.oneTime')}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="font-semibold text-foreground">{t('donate.donationTotal')}</dt>
              <dd className="font-semibold text-foreground">{formatAud(amount)}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span>{t('donate.stripeLabel')}</span>
            <CreditCardIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>

          <div className="rounded-lg border border-accent/40 bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
            {t('donate.stripeHint')}
          </div>
        </div>

        <div className="space-y-3">
          <AppButton
            type="submit"
            variant="accent"
            size="lg"
            className="w-full font-semibold"
            isLoading={isSubmitting || submitMutation.isPending}
          >
            {t('donate.donateNow')}
          </AppButton>
          <DonateSecureNote />
        </div>
      </form>
    </DonateFormCard>
  );
}
