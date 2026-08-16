import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  useDeleteVolunteerApplication,
  useVolunteerApplication,
  useVolunteerApplications,
  volunteerQueryKeys,
} from '@/features/volunteer/hooks/useVolunteerQueries';
import {
  VOLUNTEER_APPLICATION_STATUSES,
  VOLUNTEER_APPLICATION_STATUS_LABELS,
  type VolunteerApplication,
  type VolunteerApplicationStatus,
} from '@/features/volunteer/types/volunteer.types';
import { getApiErrorMessage } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

const statusFilterOptions = [
  { value: 'ALL', label: 'All statuses' },
  ...Object.values(VOLUNTEER_APPLICATION_STATUSES).map((value) => ({
    value,
    label: VOLUNTEER_APPLICATION_STATUS_LABELS[value],
  })),
];

function StatusPill({ status }: { status: VolunteerApplicationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        status === VOLUNTEER_APPLICATION_STATUSES.NEW
          ? 'bg-accent/15 text-accent-foreground'
          : status === VOLUNTEER_APPLICATION_STATUSES.REVIEWED
            ? 'bg-success/15 text-success'
            : 'bg-muted text-muted-foreground',
      )}
    >
      {VOLUNTEER_APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}

function ApplicationDetail({ application }: { application: VolunteerApplication }) {
  return (
    <dl className="space-y-4 text-sm">
      <div>
        <dt className="font-semibold text-foreground">Name</dt>
        <dd className="mt-1 text-muted-foreground">{application.fullName}</dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Email</dt>
        <dd className="mt-1 break-all">
          <a href={`mailto:${application.email}`} className="text-primary hover:underline">
            {application.email}
          </a>
        </dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Phone</dt>
        <dd className="mt-1">
          <a href={`tel:${application.phone}`} className="text-primary hover:underline">
            {application.phone}
          </a>
        </dd>
      </div>
      {(application.city || application.country) && (
        <div>
          <dt className="font-semibold text-foreground">Location</dt>
          <dd className="mt-1 text-muted-foreground">
            {[application.city, application.country].filter(Boolean).join(', ')}
          </dd>
        </div>
      )}
      <div>
        <dt className="font-semibold text-foreground">Interests</dt>
        <dd className="mt-1 text-muted-foreground">{application.interests}</dd>
      </div>
      {application.availability ? (
        <div>
          <dt className="font-semibold text-foreground">Availability</dt>
          <dd className="mt-1 text-muted-foreground">{application.availability}</dd>
        </div>
      ) : null}
      <div>
        <dt className="font-semibold text-foreground">Message</dt>
        <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">{application.message}</dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Submitted</dt>
        <dd className="mt-1 text-muted-foreground">
          {new Date(application.createdAt).toLocaleString()}
        </dd>
      </div>
    </dl>
  );
}

export function VolunteerApplicationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VolunteerApplication | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === 'ALL' ? undefined : (status as VolunteerApplicationStatus),
    }),
    [page, search, status],
  );

  const { data, isLoading, isError } = useVolunteerApplications(listParams);
  const { data: selected, isLoading: isDetailLoading } = useVolunteerApplication(viewId ?? undefined);
  const deleteMutation = useDeleteVolunteerApplication();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selected?.status === VOLUNTEER_APPLICATION_STATUSES.REVIEWED) {
      void queryClient.invalidateQueries({ queryKey: volunteerQueryKeys.all });
    }
  }, [queryClient, selected]);

  const columns: AppTableColumn<VolunteerApplication>[] = [
    {
      key: 'fullName',
      header: 'Applicant',
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.fullName}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'interests',
      header: 'Interest',
      cell: (row) => row.interests,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Submitted',
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
      toast.success('Application deleted');
      setDeleteTarget(null);
      if (viewId === deleteTarget.id) setViewId(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer applications"
        description="Applications submitted through the public Volunteer page."
      />

      <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
        <AppInput
          label="Search"
          placeholder="Search name, email, interests..."
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
        <p className="text-sm text-destructive">Unable to load applications.</p>
      ) : (
        <AppTable
          title="All applications"
          description="New applications are marked Reviewed when you open them."
          columns={columns}
          data={data?.applications ?? []}
          getRowKey={(row) => row.id}
          emptyTitle="No applications yet"
          emptyDescription="Volunteer applications will appear here when people apply."
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

      <Dialog open={Boolean(viewId)} onOpenChange={(open) => !open && setViewId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Volunteer application</DialogTitle>
            <DialogDescription>Submitted from the public Volunteer page.</DialogDescription>
          </DialogHeader>
          {isDetailLoading ? (
            <LoadingSkeleton rows={4} />
          ) : selected ? (
            <ApplicationDetail application={selected} />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete application?"
        description={
          deleteTarget
            ? `This will permanently delete the application from ${deleteTarget.fullName}.`
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
