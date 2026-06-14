import { Link, useNavigate } from 'react-router-dom';
import { AppButton, PageHeader } from '@/components/app';
import { CmsForm } from '@/features/cms/components/CmsForm';
import { useCreateCmsPage } from '@/features/cms/hooks/useCmsQueries';
import { toCmsPayload, type CmsFormValues } from '@/features/cms/schemas/cms.schema';

export function CmsCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCmsPage();

  const handleSubmit = async (values: CmsFormValues) => {
    await createMutation.mutateAsync(toCmsPayload(values));
    navigate('/admin/cms');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content management"
        title="Create CMS content"
        description="Add a new dynamic content entry for a foundation website section."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'CMS', href: '/admin/cms' },
          { label: 'Create' },
        ]}
        actions={
          <AppButton asChild variant="outline">
            <Link to="/admin/cms">Back to list</Link>
          </AppButton>
        }
      />

      <CmsForm
        submitLabel="Create content"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
