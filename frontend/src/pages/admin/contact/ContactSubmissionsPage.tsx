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
  CONTACT_SUBMISSION_STATUSES,
  CONTACT_SUBMISSION_STATUS_LABELS,
  type ContactSubmission,
  type ContactSubmissionStatus,
} from '@/features/contact/types/contact.types';
import {
  useContactSubmission,
  useContactSubmissions,
  useDeleteContactSubmission,
  contactQueryKeys,
} from '@/features/contact/hooks/useContactQueries';
import { getApiErrorMessage } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

const statusFilterOptions = [
  { value: 'ALL', label: 'All statuses' },
  ...Object.values(CONTACT_SUBMISSION_STATUSES).map((value) => ({
    value,
    label: CONTACT_SUBMISSION_STATUS_LABELS[value as ContactSubmissionStatus],
  })),
];

function StatusPill({ status }: { status: ContactSubmissionStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        status === CONTACT_SUBMISSION_STATUSES.NEW
          ? 'bg-accent/15 text-accent-foreground'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {CONTACT_SUBMISSION_STATUS_LABELS[status]}
    </span>
  );
}

function ContactSubmissionDetail({ submission }: { submission: ContactSubmission }) {
  return (
    <dl className="space-y-4 text-sm">
      <div>
        <dt className="font-semibold text-foreground">Name</dt>
        <dd className="mt-1 text-muted-foreground">{submission.name}</dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Email</dt>
        <dd className="mt-1 break-all">
          <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
            {submission.email}
          </a>
        </dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Phone</dt>
        <dd className="mt-1">
          <a href={`tel:${submission.phone}`} className="text-primary hover:underline">
            {submission.phone}
          </a>
        </dd>
      </div>
      {submission.company ? (
        <div>
          <dt className="font-semibold text-foreground">Company</dt>
          <dd className="mt-1 text-muted-foreground">{submission.company}</dd>
        </div>
      ) : null}
      <div>
        <dt className="font-semibold text-foreground">Message</dt>
        <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">{submission.message}</dd>
      </div>
      <div>
        <dt className="font-semibold text-foreground">Received</dt>
        <dd className="mt-1 text-muted-foreground">
          {new Date(submission.createdAt).toLocaleString()}
        </dd>
      </div>
    </dl>
  );
}

export function ContactSubmissionsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === 'ALL' ? undefined : (status as ContactSubmissionStatus),
    }),
    [page, search, status],
  );

  const { data, isLoading, isError } = useContactSubmissions(listParams);
  const { data: selectedSubmission, isLoading: isDetailLoading } = useContactSubmission(viewId ?? undefined);
  const deleteMutation = useDeleteContactSubmission();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedSubmission?.status === CONTACT_SUBMISSION_STATUSES.READ) {
      void queryClient.invalidateQueries({ queryKey: contactQueryKeys.all });
    }
  }, [queryClient, selectedSubmission]);

  const columns: AppTableColumn<ContactSubmission>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (row) => row.phone,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Received',
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
      toast.success('Contact submission deleted');
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
        title="Contact Messages"
        description="Messages submitted through the public Contact Us form."
      />

      <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
        <AppInput
          label="Search"
          placeholder="Search name, email, phone, message..."
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
        <p className="text-sm text-destructive">Unable to load contact submissions.</p>
      ) : (
        <AppTable
          title="All contact messages"
          description="New and read messages from the public Contact Us form."
          columns={columns}
          data={data?.submissions ?? []}
          getRowKey={(row) => row.id}
          emptyTitle="No contact messages yet"
          emptyDescription="Messages will appear here when visitors submit the Contact Us form."
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
            <DialogTitle>Contact message</DialogTitle>
            <DialogDescription>Submitted from the public Contact Us page.</DialogDescription>
          </DialogHeader>
          {isDetailLoading ? (
            <LoadingSkeleton rows={4} />
          ) : selectedSubmission ? (
            <ContactSubmissionDetail submission={selectedSubmission} />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete contact message?"
        description={
          deleteTarget
            ? `This will permanently delete the message from ${deleteTarget.name}.`
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
