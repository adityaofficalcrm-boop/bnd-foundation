import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppButton, LoadingSkeleton, PageHeader, toast } from '@/components/app';
import { CampaignForm } from '@/features/campaign/components/CampaignForm';
import { useCampaign, useUpdateCampaign } from '@/features/campaign/hooks/useCampaignQueries';
import type { CampaignFormValues } from '@/features/campaign/schemas/campaign.schema';
import { getApiErrorMessage } from '@/lib/api-errors';

export function CampaignEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: campaign, isLoading, isError } = useCampaign(id);
  const updateMutation = useUpdateCampaign();

  const handleSubmit = async (values: CampaignFormValues) => {
    if (!id) return;

    try {
      await updateMutation.mutateAsync({ id, payload: values });
      toast.success('Campaign updated successfully.');
      navigate('/admin/campaigns');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update campaign.'));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit campaign"
        description="Update campaign details, goal, and publish status."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Campaigns', href: '/admin/campaigns' },
          { label: 'Edit' },
        ]}
        actions={
          <AppButton asChild variant="outline">
            <Link to="/admin/campaigns">Back to list</Link>
          </AppButton>
        }
      />

      {isLoading ? (
        <LoadingSkeleton rows={8} />
      ) : isError || !campaign ? (
        <p className="text-sm text-destructive">Unable to load this campaign.</p>
      ) : (
        <CampaignForm
          initial={campaign}
          submitLabel="Save changes"
          isSubmitting={updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
