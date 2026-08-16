import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  AppButton,
  AppInput,
  AppSelect,
  AppTextarea,
  FormErrorSummary,
  toast,
} from '@/components/app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { flattenFormErrors, scrollToFirstFormError } from '@/lib/api-errors';
import { CmsImageField } from '@/features/cms/components/CmsImageField';
import {
  getCmsContentKind,
  getCmsContentKindLabel,
  PARTNER_GROUPS,
  TEAM_GROUPS,
} from '@/features/cms/config/cms-content-types';
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
import { NAV_SLUGS } from '@/config/public-nav';

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
    formState: { errors, submitCount },
  } = useForm<CmsFormValues>({
    resolver: zodResolver(cmsFormSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
    reValidateMode: 'onChange',
  });

  const selectedSection = watch('section');
  const titleValue = watch('title');
  const slugValue = watch('slug');
  const isNavEntry = slugValue?.startsWith('nav-');
  const contentKind = getCmsContentKind(slugValue ?? '');

  const handleTitleBlur = () => {
    const currentSlug = watch('slug');
    if (!currentSlug && titleValue) {
      setValue('slug', slugifyTitle(titleValue), { shouldValidate: true });
    }
  };

  const handleInvalid = (formErrors: typeof errors) => {
    const messages = flattenFormErrors(formErrors);

    toast.error(messages[0] ?? 'Please fix the highlighted fields before saving.');
    scrollToFirstFormError();
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit, handleInvalid)(event)}
      className="space-y-6"
      noValidate
    >
      {submitCount > 0 ? <FormErrorSummary errors={errors} /> : null}

      {slugValue ? (
        <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
          Content type: <strong>{getCmsContentKindLabel(contentKind)}</strong>
        </div>
      ) : null}

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
            helperText={
              isNavEntry
                ? 'Navigation-only entry: title sets the menu label; body is not shown on the public site.'
                : `Use nav-* slugs for menu labels only (e.g. ${NAV_SLUGS.home}, ${NAV_SLUGS.about}). Content slugs: hero, history, donors, impact, team-*`
            }
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
            {contentKind === 'footer' ? (
              <p className="text-xs text-muted-foreground">
                Put the acknowledgment first, then a blank line, then the tax notice on its own line (e.g.{' '}
                <strong>Donations of $2 or more are tax deductible in Australia.</strong>). The last paragraph
                is shown bolder on the site. Wrap text in <code>**double asterisks**</code> for inline bold.
              </p>
            ) : null}
          </div>

          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <CmsImageField
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.imageUrl?.message}
                />
                {contentKind === 'story-intro' || contentKind === 'donor-intro' || contentKind === 'team-intro' || contentKind === 'project-intro' ? (
                  slugValue === 'team-page' ? (
                    <p className="text-xs text-muted-foreground">
                      Full-width family photo on <strong>/team</strong> — shown below the page banner, above Meet Our
                      Team Members.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Upload a photo here — it appears beside the intro text on the public page (e.g. history, impact,
                      donors).
                    </p>
                  )
                ) : null}
                {slugValue === 'about-hero' ? (
                  <p className="text-xs text-muted-foreground">
                    Top banner on <strong>/about</strong>. <strong>Title</strong> = large white headline (e.g. About BnD
                    Foundation). <strong>Image</strong> = background photo.
                  </p>
                ) : null}
                {slugValue === 'about-journey-portrait-right' ? (
                  <p className="text-xs text-muted-foreground">
                    Right-side portrait for the Journey of Resilience card. Upload image only; pair with{' '}
                    <strong>about-journey-resilience</strong>.
                  </p>
                ) : null}
                {slugValue === 'about-journey-signature' ? (
                  <p className="text-xs text-muted-foreground">
                    Handwritten signature image below the journey story on <strong>/about</strong>. Upload a PNG with a
                    transparent background. Set <strong>Title</strong> to the alt text (e.g. Bhuminanda &amp; Dhaulidevi).
                    Put <strong>.</strong> in <strong>Body</strong> if required.
                  </p>
                ) : null}
                {slugValue === 'about-journey-resilience' ? (
                  <p className="text-xs text-muted-foreground">
                    Three-column journey story on <strong>/about</strong>. <strong>Image</strong> = left portrait. Pair
                    with <strong>about-journey-portrait-right</strong> and <strong>about-journey-signature</strong>.
                  </p>
                ) : null}
                {slugValue === 'about' ? (
                  <p className="text-xs text-muted-foreground">
                    Intro block on <strong>/about</strong> only (not the homepage). <strong>Subheading</strong> = main
                    heading (e.g. Learn More About Bhuminanda and Dhaulidevi). <strong>Image</strong> = portrait beside
                    text. Banner photo goes on <strong>about-hero</strong>.
                  </p>
                ) : null}
                {slugValue === 'home-about' ? (
                  <p className="text-xs text-muted-foreground">
                    Optional homepage about teaser — separate from the <strong>/about</strong> intro. Use the same field
                    layout as <strong>about</strong>. Links to <strong>/about</strong>.
                  </p>
                ) : null}
                {slugValue === 'mission' ? (
                  <p className="text-xs text-muted-foreground">
                    &quot;Our Mission&quot; row on <strong>/about</strong> only (not the homepage).{' '}
                    <strong>Heading</strong> = eyebrow (e.g. What We Strive For). <strong>Title</strong> = section
                    heading. <strong>Image</strong> = left portrait. Stats come from <strong>org-stat-*</strong> on the
                    Home Page section.
                  </p>
                ) : null}
                {slugValue === 'vision' ? (
                  <p className="text-xs text-muted-foreground">
                    &quot;Our Vision&quot; row on <strong>/about</strong> only — mirrored layout (text left, image
                    right). Same fields as <strong>mission</strong>.
                  </p>
                ) : null}
                {slugValue === 'team' ? (
                  <p className="text-xs text-muted-foreground">
                    Board section intro on <strong>/about</strong> only. Prefer slug <strong>about-team</strong> for
                    new entries. <strong>Heading</strong> = The Family. <strong>Title</strong> = Meet Our Board Members.
                  </p>
                ) : null}
                {slugValue === 'about-team' ? (
                  <p className="text-xs text-muted-foreground">
                    Board section intro on <strong>/about</strong> only (not <strong>/team</strong>).{' '}
                    <strong>Heading</strong> = The Family. <strong>Title</strong> = Meet Our Board Members.{' '}
                    <strong>Subheading</strong> = subtitle below title.
                  </p>
                ) : null}
                {slugValue === 'team-page' ? (
                  <p className="text-xs text-muted-foreground">
                    <strong>/team</strong> page only. <strong>Heading</strong> = family photo caption (e.g. The Family).{' '}
                    <strong>Title</strong> = Meet Our Team Members. <strong>Subheading</strong> = intro line below title.{' '}
                    <strong>Image</strong> = full-width family photo below the banner (not the banner itself).
                  </p>
                ) : null}
                {slugValue === 'team-cta' ? (
                  <p className="text-xs text-muted-foreground">
                    Donate banner at the bottom of <strong>/team</strong>. Same fields as <strong>about-cta</strong>.
                  </p>
                ) : null}
                {slugValue === 'about-cta' ? (
                  <p className="text-xs text-muted-foreground">
                    Donate banner at the bottom of <strong>/about</strong>. <strong>Title</strong> +{' '}
                    <strong>Subheading</strong> = banner headline lines. <strong>Image</strong> = background photo.
                  </p>
                ) : null}
                {slugValue === 'history-hero' ? (
                  <p className="text-xs text-muted-foreground">
                    Top banner on <strong>/about/history</strong>. <strong>Title</strong> = white headline (e.g. Our
                    History). <strong>Image</strong> = background photo.
                  </p>
                ) : null}
                {slugValue === 'history' ? (
                  <p className="text-xs text-muted-foreground">
                    Main intro on <strong>/about/history</strong>. <strong>Title</strong> = heading below the banner.{' '}
                    <strong>Body</strong> = history paragraph. Banner photo goes on <strong>history-hero</strong>.
                  </p>
                ) : null}
                {contentKind === 'story-section' && slugValue.startsWith('history-') ? (
                  <p className="text-xs text-muted-foreground">
                    Story row on <strong>/about/history</strong> (alternating image left/right). <strong>Heading</strong>{' '}
                    = eyebrow (e.g. Education Support). <strong>Title</strong> = section heading. <strong>Image</strong>{' '}
                    = photo beside text. Suggested slugs: <strong>history-education</strong>,{' '}
                    <strong>history-community</strong>, <strong>history-emergency</strong>,{' '}
                    <strong>history-future</strong>. Use sort order 0, 1, 2, 3.
                  </p>
                ) : null}
                {slugValue === 'history-cta' ? (
                  <p className="text-xs text-muted-foreground">
                    Optional donate banner at the bottom of <strong>/about/history</strong>. Same fields as{' '}
                    <strong>about-cta</strong>.
                  </p>
                ) : null}
                {slugValue === 'impact-hero' ? (
                  <p className="text-xs text-muted-foreground">
                    Top banner on <strong>/about/impact</strong>. <strong>Title</strong> = white headline (e.g. Our
                    Impact). <strong>Image</strong> = background photo.
                  </p>
                ) : null}
                {slugValue === 'impact' ? (
                  <p className="text-xs text-muted-foreground">
                    Intro on <strong>/about/impact</strong>. <strong>Title</strong> = heading below the banner.{' '}
                    <strong>Body</strong> = intro paragraph. Banner photo goes on <strong>impact-hero</strong>.
                  </p>
                ) : null}
                {contentKind === 'story-section' && slugValue.startsWith('impact-') ? (
                  <p className="text-xs text-muted-foreground">
                    Program card on <strong>/about/impact</strong> (alternating image left/right). <strong>Title</strong>{' '}
                    = card heading. <strong>Body</strong> = intro paragraph, blank line, then bullet list (lines starting
                    with <code>-</code>). Use <code>**text**</code> for bold in bullets. Suggested slugs:{' '}
                    <strong>impact-tutoring</strong>, <strong>impact-food-relief</strong>,{' '}
                    <strong>impact-refugees</strong>, <strong>impact-emergency</strong>.
                  </p>
                ) : null}
                {slugValue === 'impact-cta' ? (
                  <p className="text-xs text-muted-foreground">
                    Donate banner at the bottom of <strong>/about/impact</strong>. <strong>Title</strong> = e.g. We Have
                    Done Many Crowdfunding Donations.
                  </p>
                ) : null}
                {slugValue === 'donors-hero' ? (
                  <p className="text-xs text-muted-foreground">
                    Top banner on <strong>/about/donors</strong>. <strong>Title</strong> = white headline (e.g. Our
                    Donors). <strong>Image</strong> = background photo.
                  </p>
                ) : null}
                {slugValue === 'donors' ? (
                  <p className="text-xs text-muted-foreground">
                    Intro on <strong>/about/donors</strong>. <strong>Heading</strong> = Our Donors.{' '}
                    <strong>Title</strong> = Partners in Change. <strong>Body</strong> = intro paragraphs. Banner photo
                    goes on <strong>donors-hero</strong>.
                  </p>
                ) : null}
                {slugValue === 'donors-list-heading' ? (
                  <p className="text-xs text-muted-foreground">
                    Optional heading above the donor list. <strong>Heading</strong> = Recent Donations.{' '}
                    <strong>Title</strong> = Thank You for Making a Difference. Put <strong>.</strong> in{' '}
                    <strong>Body</strong> if required.
                  </p>
                ) : null}
                {slugValue === 'donors-cta' ? (
                  <p className="text-xs text-muted-foreground">
                    Donate banner at the bottom of <strong>/about/donors</strong>. Same fields as{' '}
                    <strong>about-cta</strong>.
                  </p>
                ) : null}
                {slugValue === 'projects-hero' ? (
                  <p className="text-xs text-muted-foreground">
                    Top banner on <strong>/projects</strong>. <strong>Title</strong> = white headline (e.g. Current
                    Projects). <strong>Image</strong> = background photo.
                  </p>
                ) : null}
                {slugValue === 'projects' ? (
                  <p className="text-xs text-muted-foreground">
                    Intro on <strong>/projects</strong>. <strong>Heading</strong> = eyebrow (e.g. Our Donors).{' '}
                    <strong>Title</strong> = Partners in Change. <strong>Body</strong> = intro paragraphs. Banner photo
                    goes on <strong>projects-hero</strong>.
                  </p>
                ) : null}
                {slugValue === 'projects-grants-heading' ? (
                  <p className="text-xs text-muted-foreground">
                    Heading above the grants list on <strong>/projects</strong>. <strong>Heading</strong> = Grants
                    Received. <strong>Title</strong> = Thank You for Making a Difference.
                  </p>
                ) : null}
                {slugValue === 'projects-cta' ? (
                  <p className="text-xs text-muted-foreground">
                    Donate banner at the bottom of <strong>/projects</strong>. Same fields as <strong>about-cta</strong>.
                  </p>
                ) : null}
                {contentKind === 'project-featured' ? (
                  <p className="text-xs text-muted-foreground">
                    Ongoing project card on <strong>/projects</strong>. <strong>Heading</strong> = section label (e.g.
                    Ongoing Project). <strong>Title</strong> = project name. <strong>Image</strong> = flyer or photo.{' '}
                    <strong>Body</strong> = description. <strong>Button label</strong> + <strong>Button URL</strong> =
                    apply link. Suggested slug: <strong>project-empowered</strong>.
                  </p>
                ) : null}
                {contentKind === 'grant-card' ? (
                  <p className="text-xs text-muted-foreground md:col-span-2">
                    Grant row on <strong>/projects</strong>. <strong>Title</strong> = grant project name.{' '}
                    <strong>Grant provider</strong> = funder name. <strong>Donation amount</strong> = e.g. $1000.00
                    (top-right). <strong>Image</strong> = funder logo. <strong>Body</strong> = description. Suggested
                    slugs: <strong>grant-casey-maths</strong>, <strong>grant-ucf</strong>.
                  </p>
                ) : null}
                {slugValue === 'cta-heading' ? (
                  <p className="text-xs text-muted-foreground">
                    Large photo shown on the left of the &quot;How You Can Help&quot; section on the homepage.
                  </p>
                ) : null}
                {contentKind === 'cta' && slugValue !== 'cta-heading' ? (
                  <p className="text-xs text-muted-foreground">
                    Optional small icon image for this item. Leave empty to use a default icon.
                  </p>
                ) : null}
                {slugValue === 'stats-heading' ? (
                  <p className="text-xs text-muted-foreground">
                    Not used for this entry — impact icons go on each <strong>stat-*</strong> card instead.
                  </p>
                ) : null}
                {contentKind === 'stat' ? (
                  <p className="text-xs text-muted-foreground">
                    Optional icon for this impact card. Leave empty to use a default icon based on the slug.
                  </p>
                ) : null}
                {contentKind === 'org-stat' ? (
                  <p className="text-xs text-muted-foreground">
                    Shown in the About mission row and homepage partners bar. Set the number in{' '}
                    <strong>Subheading</strong> (e.g. 200+) and the label in <strong>Title</strong> (e.g. Donations).
                  </p>
                ) : null}
                {contentKind === 'partner' ? (
                  <p className="text-xs text-muted-foreground">
                    Upload the partner logo (PNG or SVG with transparent background works best).
                  </p>
                ) : null}
                {contentKind === 'donate-banner' || contentKind === 'donate-slide' ? (
                  <p className="text-xs text-muted-foreground">
                    Background photo for this donate banner slide. Use multiple <strong>donate-slide-*</strong> entries for a carousel.
                  </p>
                ) : null}
                {contentKind === 'facebook-updates' ? (
                  <p className="text-xs text-muted-foreground">
                    Optional cover image — the Facebook feed uses the URL in structured fields.
                  </p>
                ) : null}
                {contentKind === 'footer-address' ? (
                  <p className="text-xs text-muted-foreground">
                    Put the full office address in <strong>Body</strong>. It links to Google Maps in a new tab. Optional
                    custom Maps URL below.
                  </p>
                ) : null}
                {contentKind === 'footer-touch' ? (
                  <p className="text-xs text-muted-foreground">
                    Put the location address in <strong>Body</strong>. It links to Google Maps in a new tab. Optional
                    custom Maps URL below.
                  </p>
                ) : null}
              </div>
            )}
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

      {contentKind === 'footer' && (
        <Card className="shadow-card border-primary/20">
          <CardHeader>
            <CardTitle>Footer settings &amp; social links</CardTitle>
            <CardDescription>
              Copyright, support credit, and social URLs appear in the site footer. Use slug{' '}
              <strong>footer-main</strong> and section <strong>Footer Settings</strong>. Body above is the
              acknowledgment text.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <AppInput label="Copyright text" error={errors.meta?.copyright?.message} {...register('meta.copyright')} />
            </div>
            <div className="md:col-span-2">
              <AppInput
                label="Support credit line"
                placeholder="Supported by Ledger IT."
                error={errors.meta?.supportCredit?.message}
                {...register('meta.supportCredit')}
              />
            </div>
            <AppInput label="Facebook URL" error={errors.meta?.socialFacebook?.message} {...register('meta.socialFacebook')} />
            <AppInput label="LinkedIn URL" error={errors.meta?.socialLinkedin?.message} {...register('meta.socialLinkedin')} />
            <AppInput label="YouTube URL" error={errors.meta?.socialYoutube?.message} {...register('meta.socialYoutube')} />
            <AppInput label="Twitter URL" error={errors.meta?.socialTwitter?.message} {...register('meta.socialTwitter')} />
            <AppInput label="Instagram URL" error={errors.meta?.socialInstagram?.message} {...register('meta.socialInstagram')} />
          </CardContent>
        </Card>
      )}

      {(selectedSection === CMS_SECTIONS.CONTACT_INFO ||
        ['team-member', 'donor-card', 'grant-card', 'project-featured', 'story-cta', 'partner', 'donate-banner', 'donate-slide', 'facebook-updates', 'footer-address', 'footer-touch'].includes(contentKind)) && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Structured fields</CardTitle>
            <CardDescription>Extra fields used by the public website layout for this content type.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {selectedSection === CMS_SECTIONS.CONTACT_INFO && (
              <>
                <AppInput label="Email" type="email" error={errors.meta?.email?.message} {...register('meta.email')} />
                <AppInput label="Phone" error={errors.meta?.phone?.message} {...register('meta.phone')} />
                <div className="md:col-span-2">
                  <AppTextarea label="Address" rows={3} error={errors.meta?.address?.message} {...register('meta.address')} />
                </div>
                {slugValue === 'contact-main' ? (
                  <p className="text-xs text-muted-foreground md:col-span-2">
                    Powers <strong>/contact</strong>. <strong>Title</strong> = Contact Us. <strong>Subheading</strong> =
                    intro line. <strong>Email</strong>, <strong>Phone</strong>, <strong>Address</strong> = detail
                    cards and map embed (map is generated from address).
                  </p>
                ) : null}
              </>
            )}

            {(contentKind === 'footer-address' || contentKind === 'footer-touch') && (
              <div className="md:col-span-2">
                <AppInput
                  label="Google Maps URL (optional)"
                  placeholder="Leave empty to auto-search the address on Google Maps"
                  error={errors.meta?.ctaUrl?.message}
                  {...register('meta.ctaUrl')}
                />
              </div>
            )}

            {contentKind === 'team-member' && (
              <>
                <AppInput label="Role / position" error={errors.meta?.role?.message} {...register('meta.role')} />
                <p className="text-xs text-muted-foreground md:col-span-2">
                  One slug per person per section (e.g. <strong>team-kamala-advisor</strong> and{' '}
                  <strong>team-kamala-nepal</strong> if they appear in two groups). The same name in Board + another
                  group only shows in the non-board section on <strong>/team</strong>. Set Board for{' '}
                  <strong>/about</strong> board grid. <strong>Title</strong> = name, <strong>Image</strong> = portrait,{' '}
                  <strong>Role</strong> = position.
                </p>
                <Controller
                  name="meta.group"
                  control={control}
                  render={({ field }) => (
                    <AppSelect
                      label="Team group"
                      options={TEAM_GROUPS.map((group) => ({ value: group.value, label: group.label }))}
                      value={field.value ?? 'board'}
                      onValueChange={field.onChange}
                      error={errors.meta?.group?.message}
                    />
                  )}
                />
              </>
            )}

            {contentKind === 'donor-card' && (
              <>
                <AppInput label="Donation amount" placeholder="$365.00" error={errors.meta?.amount?.message} {...register('meta.amount')} />
                <AppInput label="Location" placeholder="Melbourne, Australia" error={errors.meta?.location?.message} {...register('meta.location')} />
                <p className="text-xs text-muted-foreground md:col-span-2">
                  Donor row on <strong>/about/donors</strong>. <strong>Title</strong> = name. <strong>Subheading</strong>{' '}
                  = quote. <strong>Image</strong> = profile photo (optional). Amount shows top-right on the card.
                </p>
              </>
            )}

            {contentKind === 'grant-card' && (
              <>
                <AppInput
                  label="Grant provider"
                  placeholder="City of Casey – Quick Response Grant"
                  error={errors.meta?.grantProvider?.message}
                  {...register('meta.grantProvider')}
                />
                <AppInput
                  label="Grant amount"
                  placeholder="$1000.00"
                  error={errors.meta?.amount?.message}
                  {...register('meta.amount')}
                />
              </>
            )}

            {contentKind === 'partner' && (
              <Controller
                name="meta.group"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    label="Partner group"
                    options={PARTNER_GROUPS.map((group) => ({ value: group.value, label: group.label }))}
                    value={field.value ?? 'funding'}
                    onValueChange={field.onChange}
                    error={errors.meta?.group?.message}
                  />
                )}
              />
            )}

            {(contentKind === 'project-featured' || contentKind === 'story-cta' || contentKind === 'donate-banner' || contentKind === 'donate-slide') && (
              <>
                <AppInput label="Button label" error={errors.meta?.ctaLabel?.message} {...register('meta.ctaLabel')} />
                <AppInput label="Button URL" error={errors.meta?.ctaUrl?.message} {...register('meta.ctaUrl')} />
              </>
            )}

            {contentKind === 'facebook-updates' && (
              <div className="md:col-span-2">
                <AppInput
                  label="Facebook page URL"
                  placeholder="https://www.facebook.com/your-page"
                  error={errors.meta?.socialFacebook?.message}
                  {...register('meta.socialFacebook')}
                />
              </div>
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
