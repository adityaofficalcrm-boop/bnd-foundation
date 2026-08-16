import { Link, useNavigate } from 'react-router-dom';
import { AppButton, PageHeader, toast } from '@/components/app';
import { CampaignForm } from '@/features/campaign/components/CampaignForm';
import { useCreateCampaign } from '@/features/campaign/hooks/useCampaignQueries';
import type { CampaignFormValues } from '@/features/campaign/schemas/campaign.schema';
import { getApiErrorMessage } from '@/lib/api-errors';

export function CampaignCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCampaign();

  const handleSubmit = async (values: CampaignFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success('Campaign created successfully.');
      navigate('/admin/campaigns');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to create campaign.'));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Create campaign"
        description="Add a fundraising campaign. Set status to Active to publish it."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Campaigns', href: '/admin/campaigns' },
          { label: 'Create' },
        ]}
        actions={
          <AppButton asChild variant="outline">
            <Link to="/admin/campaigns">Back to list</Link>
          </AppButton>
        }
      />

      <CampaignForm
        submitLabel="Create campaign"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
