import { useMemo, useState } from 'react';
import { EyeIcon, Trash2Icon } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DONATION_STATUSES,
  DONATION_STATUS_LABELS,
  type Donation,
  type DonationStatus,
} from '@/features/donation/types/donation.types';
import {
  useDeleteDonation,
  useDonation,
  useDonations,
} from '@/features/donation/hooks/useDonationQueries';
import { formatAudFromCents } from '@/lib/currency';
import { getApiErrorMessage } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

const statusFilterOptions = [
  { value: 'ALL', label: 'All statuses' },
  ...Object.values(DONATION_STATUSES).map((value) => ({
    value,
    label: DONATION_STATUS_LABELS[value as DonationStatus],
  })),
];

function StatusPill({ status }: { status: DonationStatus }) {
  const styles: Record<DonationStatus, string> = {
    PENDING: 'bg-warning/15 text-warning',
    PAID: 'bg-success/15 text-success',
    FAILED: 'bg-destructive/15 text-destructive',
    REFUNDED: 'bg-muted text-muted-foreground',
    CANCELLED: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        styles[status],
      )}
    >
      {DONATION_STATUS_LABELS[status]}
    </span>
  );
}

function DonationDetail({ donation }: { donation: Donation }) {
  return (
    <dl className="space-y-4 text-sm">
      <div>
        <dt className="font-semibold text-foreground">Donor</dt>
        <dd className="mt-1 text-muted-foreground">{donation.donorName}</dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Email</dt>
        <dd className="mt-1 break-all">
          <a href={`mailto:${donation.email}`} className="text-primary hover:underline">
            {donation.email}
          </a>
        </dd>
      </div>
      {donation.phone ? (
        <div>
          <dt className="font-semibold text-foreground">Phone</dt>
          <dd className="mt-1">
            <a href={`tel:${donation.phone}`} className="text-primary hover:underline">
              {donation.phone}
            </a>
          </dd>
        </div>
      ) : null}
      {donation.country ? (
        <div>
          <dt className="font-semibold text-foreground">Country</dt>
          <dd className="mt-1 text-muted-foreground">{donation.country}</dd>
        </div>
      ) : null}
      <div>
        <dt className="font-semibold text-foreground">Amount</dt>
        <dd className="mt-1 font-medium text-foreground">
          {formatAudFromCents(donation.amountCents)} {donation.currency.toUpperCase()}
        </dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Status</dt>
        <dd className="mt-1">
          <StatusPill status={donation.status} />
        </dd>
      </div>
      {donation.transactionId ? (
        <div>
          <dt className="font-semibold text-foreground">Transaction ID</dt>
          <dd className="mt-1 break-all font-mono text-xs text-muted-foreground">
            {donation.transactionId}
          </dd>
        </div>
      ) : null}
      <div>
        <dt className="font-semibold text-foreground">Submitted</dt>
        <dd className="mt-1 text-muted-foreground">
          {new Date(donation.createdAt).toLocaleString()}
        </dd>
      </div>
    </dl>
  );
}

export function DonationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Donation | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === 'ALL' ? undefined : (status as DonationStatus),
    }),
    [page, search, status],
  );

  const { data, isLoading, isError } = useDonations(listParams);
  const { data: selectedDonation, isLoading: isDetailLoading } = useDonation(viewId ?? undefined);
  const deleteMutation = useDeleteDonation();

  const columns: AppTableColumn<Donation>[] = [
    {
      key: 'donorName',
      header: 'Donor',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.donorName}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'amountCents',
      header: 'Amount',
      sortable: true,
      cell: (row) => formatAudFromCents(row.amountCents),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      sortable: true,
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <AppButton variant="outline" size="sm" onClick={() => setViewId(row.id)}>
            <EyeIcon className="size-3.5" />
            View
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
      toast.success('Donation deleted');
      setDeleteTarget(null);
      if (viewId === deleteTarget.id) {
        setViewId(null);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donations"
        description="Donation pledges submitted through the public Donate page. Card payments will be enabled with Stripe."
      />

      <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
        <AppInput
          label="Search"
          placeholder="Search donor, email, phone..."
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
        <p className="text-sm text-destructive">Unable to load donations.</p>
      ) : (
        <AppTable
          title="All donations"
          description="Pending pledges until Stripe checkout is connected."
          columns={columns}
          data={data?.donations ?? []}
          getRowKey={(row) => row.id}
          emptyTitle="No donations yet"
          emptyDescription="Donations will appear here when visitors submit the public Donate form."
          footer={
            data?.pagination ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages} · {data.pagination.total}{' '}
                  total
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

      <Dialog open={Boolean(viewId)} onOpenChange={(open) => !open && setViewId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Donation details</DialogTitle>
            <DialogDescription>Submitted from the public Donate page.</DialogDescription>
          </DialogHeader>
          {isDetailLoading ? (
            <LoadingSkeleton rows={4} />
          ) : selectedDonation ? (
            <DonationDetail donation={selectedDonation} />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete donation?"
        description={
          deleteTarget
            ? `This will permanently delete the donation from ${deleteTarget.donorName} (${formatAudFromCents(deleteTarget.amountCents)}).`
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
