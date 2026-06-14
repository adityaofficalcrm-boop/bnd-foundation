import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  AppButton,
  AppInput,
  AppSelect,
  AppTextarea,
} from '@/components/app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CMS_SECTION_LABELS,
  CMS_SECTIONS,
  CMS_STATUS_LABELS,
  CMS_STATUSES,
  type CmsSection,
} from '@/features/cms/types/cms.types';
import {
  cmsFormSchema,
  slugifyTitle,
  type CmsFormValues,
} from '@/features/cms/schemas/cms.schema';

const sectionOptions = Object.values(CMS_SECTIONS).map((value) => ({
  value,
  label: CMS_SECTION_LABELS[value as CmsSection],
}));

const statusOptions = Object.values(CMS_STATUSES).map((value) => ({
  value,
  label: CMS_STATUS_LABELS[value as keyof typeof CMS_STATUS_LABELS],
}));

type CmsFormProps = {
  defaultValues?: Partial<CmsFormValues>;
  onSubmit: (values: CmsFormValues) => Promise<void>;
  submitLabel: string;
  isSubmitting?: boolean;
};

const emptyDefaults: CmsFormValues = {
  section: CMS_SECTIONS.HOME,
  title: '',
  slug: '',
  heading: '',
  subheading: '',
  body: '',
  imageUrl: '',
  status: CMS_STATUSES.DRAFT,
  sortOrder: 0,
  meta: {},
};

export function CmsForm({ defaultValues, onSubmit, submitLabel, isSubmitting }: CmsFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CmsFormValues>({
    resolver: zodResolver(cmsFormSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  const selectedSection = watch('section');
  const titleValue = watch('title');

  const handleTitleBlur = () => {
    const currentSlug = watch('slug');
    if (!currentSlug && titleValue) {
      setValue('slug', slugifyTitle(titleValue), { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Content details</CardTitle>
          <CardDescription>Define the section, title, and main content for this CMS entry.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <Controller
            name="section"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Section"
                options={sectionOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.section?.message}
                required
              />
            )}
          />

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
                required
              />
            )}
          />

          <AppInput
            label="Title"
            placeholder="Homepage hero content"
            error={errors.title?.message}
            required
            {...register('title')}
            onBlur={handleTitleBlur}
          />

          <AppInput
            label="Slug"
            placeholder="homepage-hero"
            helperText="Used for internal identification and future public URLs"
            error={errors.slug?.message}
            required
            {...register('slug')}
          />

          <AppInput
            label="Heading"
            placeholder="Optional display heading"
            error={errors.heading?.message}
            {...register('heading')}
          />

          <AppInput
            label="Subheading"
            placeholder="Optional supporting line"
            error={errors.subheading?.message}
            {...register('subheading')}
          />

          <div className="md:col-span-2">
            <AppTextarea
              label="Body content"
              placeholder="Enter the main content for this section..."
              rows={8}
              error={errors.body?.message}
              required
              {...register('body')}
            />
          </div>

          <AppInput
            label="Image URL"
            placeholder="https://example.org/images/hero.jpg"
            helperText="Image uploads will be supported in a later phase"
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />

          <AppInput
            label="Sort order"
            type="number"
            min={0}
            error={errors.sortOrder?.message}
            {...register('sortOrder', { valueAsNumber: true })}
          />
        </CardContent>
      </Card>

      {(selectedSection === CMS_SECTIONS.CONTACT_INFO || selectedSection === CMS_SECTIONS.FOOTER) && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Section-specific fields</CardTitle>
            <CardDescription>
              Additional structured content for {CMS_SECTION_LABELS[selectedSection]}.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {selectedSection === CMS_SECTIONS.CONTACT_INFO && (
              <>
                <AppInput label="Email" type="email" error={errors.meta?.email?.message} {...register('meta.email')} />
                <AppInput label="Phone" error={errors.meta?.phone?.message} {...register('meta.phone')} />
                <div className="md:col-span-2">
                  <AppTextarea label="Address" rows={3} error={errors.meta?.address?.message} {...register('meta.address')} />
                </div>
              </>
            )}

            {selectedSection === CMS_SECTIONS.FOOTER && (
              <>
                <div className="md:col-span-2">
                  <AppInput label="Copyright text" error={errors.meta?.copyright?.message} {...register('meta.copyright')} />
                </div>
                <AppInput label="Facebook URL" error={errors.meta?.socialFacebook?.message} {...register('meta.socialFacebook')} />
                <AppInput label="Twitter URL" error={errors.meta?.socialTwitter?.message} {...register('meta.socialTwitter')} />
                <AppInput label="Instagram URL" error={errors.meta?.socialInstagram?.message} {...register('meta.socialInstagram')} />
                <AppInput label="LinkedIn URL" error={errors.meta?.socialLinkedin?.message} {...register('meta.socialLinkedin')} />
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <AppButton type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </AppButton>
      </div>
    </form>
  );
}
