import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MegaphoneIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import {
  AppButton,
  AppInput,
  AppSelect,
  AppTable,
  ConfirmDialog,
  LoadingSkeleton,
  PageHeader,
  toast,
  type AppTableColumn,
} from '@/components/app';
import {
  useCampaigns,
  useDeleteCampaign,
} from '@/features/campaign/hooks/useCampaignQueries';
import {
  CAMPAIGN_STATUSES,
  CAMPAIGN_STATUS_LABELS,
  type Campaign,
  type CampaignStatus,
} from '@/features/campaign/types/campaign.types';
import { formatAudFromCents } from '@/lib/currency';
import { getApiErrorMessage } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

const statusFilterOptions = [
  { value: 'ALL', label: 'All statuses' },
  ...Object.values(CAMPAIGN_STATUSES).map((value) => ({
    value,
    label: CAMPAIGN_STATUS_LABELS[value],
  })),
];

function StatusPill({ status }: { status: CampaignStatus }) {
  const styles: Record<CampaignStatus, string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    ACTIVE: 'bg-success/15 text-success',
    COMPLETED: 'bg-primary/15 text-primary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        styles[status],
      )}
    >
      {CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}

function progressPercent(campaign: Campaign): number {
  if (campaign.goalAmountCents <= 0) return 0;
  return Math.min(100, Math.round((campaign.raisedAmountCents / campaign.goalAmountCents) * 100));
}

export function CampaignsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === 'ALL' ? undefined : (status as CampaignStatus),
    }),
    [page, search, status],
  );

  const { data, isLoading, isError } = useCampaigns(listParams);
  const deleteMutation = useDeleteCampaign();

  const columns: AppTableColumn<Campaign>[] = [
    {
      key: 'title',
      header: 'Campaign',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'goalAmountCents',
      header: 'Progress',
      cell: (row) => (
        <div>
          <p className="text-sm font-medium">
            {formatAudFromCents(row.raisedAmountCents)} / {formatAudFromCents(row.goalAmountCents)}
          </p>
          <p className="text-xs text-muted-foreground">{progressPercent(row)}% raised</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <AppButton asChild variant="outline" size="sm">
            <Link to={`/admin/campaigns/${row.id}/edit`}>
              <PencilIcon className="size-3.5" />
              Edit
            </Link>
          </AppButton>
          <AppButton variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
            <Trash2Icon className="size-3.5" />
            Delete
          </AppButton>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Campaign deleted');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Create and publish fundraising campaigns for the public site."
        actions={
          <AppButton asChild variant="primary">
            <Link to="/admin/campaigns/new">
              <PlusIcon className="size-4" />
              New campaign
            </Link>
          </AppButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
        <AppInput
          label="Search"
          placeholder="Search title, slug, description..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <AppSelect
          label="Status"
          options={statusFilterOptions}
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : isError ? (
        <p className="text-sm text-destructive">Unable to load campaigns.</p>
      ) : (
        <AppTable
          title="All campaigns"
          description="Draft stays private. Active and Completed appear on /campaigns."
          columns={columns}
          data={data?.campaigns ?? []}
          getRowKey={(row) => row.id}
          emptyTitle="No campaigns yet"
          emptyDescription="Create your first campaign to start fundraising."
          emptyIcon={MegaphoneIcon}
          footer={
            data?.pagination ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages} ·{' '}
                  {data.pagination.total} total
                </p>
                <div className="flex gap-2">
                  <AppButton
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </AppButton>
                  <AppButton
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page >= data.pagination.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </AppButton>
                </div>
              </>
            ) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete campaign?"
        description={
          deleteTarget
            ? `This will permanently delete “${deleteTarget.title}”.`
            : undefined
        }
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
