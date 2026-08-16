import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppButton, LoadingSkeleton, PageHeader, toast } from '@/components/app';
import { CmsForm } from '@/features/cms/components/CmsForm';
import { useCmsPage, useUpdateCmsPage } from '@/features/cms/hooks/useCmsQueries';
import { cmsPageToFormValues, toCmsUpdatePayload, type CmsFormValues } from '@/features/cms/schemas/cms.schema';
import { getApiErrorMessage } from '@/lib/api-errors';

export function CmsEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: page, isLoading, isError } = useCmsPage(id);
  const updateMutation = useUpdateCmsPage(id ?? '');

  const handleSubmit = async (values: CmsFormValues) => {
    try {
      await updateMutation.mutateAsync(toCmsUpdatePayload(values));
      toast.success('Content updated successfully.');
      navigate('/admin/cms');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update content.'));
    }
  };

  if (isLoading) {
    return <LoadingSkeleton variant="form" rows={6} />;
  }

  if (isError || !page) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        CMS page not found or could not be loaded.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content management"
        title={`Edit: ${page.title}`}
        description="Update content, status, and section-specific fields for this CMS entry."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'CMS', href: '/admin/cms' },
          { label: 'Edit' },
        ]}
        actions={
          <AppButton asChild variant="outline">
            <Link to="/admin/cms">Back to list</Link>
          </AppButton>
        }
      />

      <CmsForm
        key={page.id}
        defaultValues={cmsPageToFormValues(page)}
        submitLabel="Save changes"
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
