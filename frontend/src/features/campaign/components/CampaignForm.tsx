import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, AppInput, AppSelect, AppTextarea } from '@/components/app';
import { CmsImageField } from '@/features/cms/components/CmsImageField';
import {
  campaignFormSchema,
  type CampaignFormValues,
} from '@/features/campaign/schemas/campaign.schema';
import {
  CAMPAIGN_STATUSES,
  CAMPAIGN_STATUS_LABELS,
  type Campaign,
} from '@/features/campaign/types/campaign.types';

const statusOptions = Object.values(CAMPAIGN_STATUSES).map((value) => ({
  value,
  label: CAMPAIGN_STATUS_LABELS[value],
}));

function toDateInputValue(iso?: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

type CampaignFormProps = {
  initial?: Campaign;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CampaignFormValues) => Promise<void>;
};

export function CampaignForm({ initial, submitLabel, isSubmitting, onSubmit }: CampaignFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
      goalAmount: initial ? initial.goalAmountCents / 100 : 1000,
      raisedAmount: initial ? initial.raisedAmountCents / 100 : 0,
      coverImageUrl: initial?.coverImageUrl ?? '',
      status: initial?.status ?? CAMPAIGN_STATUSES.DRAFT,
      startDate: toDateInputValue(initial?.startDate),
      endDate: toDateInputValue(initial?.endDate),
      sortOrder: initial?.sortOrder ?? 0,
    },
  });

  return (
    <form
      className="space-y-6 rounded-xl border bg-card p-6 shadow-card"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          slug: values.slug?.trim() || undefined,
          coverImageUrl: values.coverImageUrl?.trim() || undefined,
          startDate: values.startDate || undefined,
          endDate: values.endDate || undefined,
        });
      })}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <AppInput label="Title" required error={errors.title?.message} {...register('title')} />
        <AppInput
          label="Slug"
          placeholder="Auto-generated from title if empty"
          error={errors.slug?.message}
          {...register('slug')}
        />
      </div>

      <AppTextarea
        label="Description"
        required
        rows={6}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AppInput
          label="Goal amount (AUD)"
          type="number"
          min={1}
          step="1"
          required
          error={errors.goalAmount?.message}
          {...register('goalAmount', { valueAsNumber: true })}
        />
        <AppInput
          label="Raised amount (AUD)"
          type="number"
          min={0}
          step="1"
          error={errors.raisedAmount?.message}
          {...register('raisedAmount', { valueAsNumber: true })}
        />
        <AppInput
          label="Sort order"
          type="number"
          step="1"
          error={errors.sortOrder?.message}
          {...register('sortOrder', { valueAsNumber: true })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <AppSelect
              label="Status"
              options={statusOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.status?.message}
            />
          )}
        />
        <AppInput
          label="Start date"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <AppInput
          label="End date"
          type="date"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      <Controller
        name="coverImageUrl"
        control={control}
        render={({ field }) => (
          <CmsImageField
            label="Cover image"
            value={field.value}
            onChange={field.onChange}
            error={errors.coverImageUrl?.message}
            helperText="Upload a cover image or paste a URL. Stored on our server."
          />
        )}
      />

      <p className="text-xs text-muted-foreground">
        Set status to <strong>Active</strong> or <strong>Completed</strong> to show this campaign on
        the public site. Draft campaigns stay admin-only.
      </p>

      <AppButton type="submit" variant="primary" isLoading={isSubmitting}>
        {submitLabel}
      </AppButton>
    </form>
  );
}
