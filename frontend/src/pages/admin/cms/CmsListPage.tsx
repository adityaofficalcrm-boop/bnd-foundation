import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileTextIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
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
  CMS_SECTION_LABELS,
  CMS_SECTIONS,
  CMS_STATUS_LABELS,
  CMS_STATUSES,
  type CmsPage,
  type CmsSection,
  type CmsStatus,
} from '@/features/cms/types/cms.types';
import { useCmsList, useDeleteCmsPage } from '@/features/cms/hooks/useCmsQueries';
import { getApiErrorMessage } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

const sectionFilterOptions = [
  { value: 'ALL', label: 'All sections' },
  ...Object.values(CMS_SECTIONS).map((value) => ({
    value,
    label: CMS_SECTION_LABELS[value as CmsSection],
  })),
];

const statusFilterOptions = [
  { value: 'ALL', label: 'All statuses' },
  ...Object.values(CMS_STATUSES).map((value) => ({
    value,
    label: CMS_STATUS_LABELS[value as CmsStatus],
  })),
];

function StatusPill({ status }: { status: CmsStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        status === CMS_STATUSES.PUBLISHED
          ? 'bg-success/10 text-success'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {CMS_STATUS_LABELS[status]}
    </span>
  );
}

export type CmsListPageProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  breadcrumbLabel?: string;
  tableTitle?: string;
  tableDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  createLabel?: string;
  defaultSearch?: string;
  defaultSection?: string;
};

export function CmsListPage({
  eyebrow = 'Content management',
  title = 'CMS pages',
  description = 'Manage dynamic website content for home, about, mission, contact, and footer sections.',
  breadcrumbLabel = 'CMS',
  tableTitle = 'All content entries',
  tableDescription = 'Draft and published content across all CMS sections.',
  emptyTitle = 'No CMS content yet',
  emptyDescription = 'Create your first content entry to populate the foundation website.',
  createLabel = 'Create content',
  defaultSearch = '',
  defaultSection = 'ALL',
}: CmsListPageProps = {}) {
  const [search, setSearch] = useState(defaultSearch);
  const [section, setSection] = useState<string>(defaultSection);
  const [status, setStatus] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<CmsPage | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      section: section === 'ALL' ? undefined : (section as CmsSection),
      status: status === 'ALL' ? undefined : (status as CmsStatus),
    }),
    [page, search, section, status],
  );

  const { data, isLoading, isError } = useCmsList(listParams);
  const deleteMutation = useDeleteCmsPage();

  const columns: AppTableColumn<CmsPage>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'section',
      header: 'Section',
      sortable: true,
      cell: (row) => CMS_SECTION_LABELS[row.section],
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      cell: (row) => new Date(row.updatedAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <AppButton asChild variant="outline" size="sm">
            <Link to={`/admin/cms/${row.id}/edit`}>
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

  const pagination = data?.pagination;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: breadcrumbLabel },
        ]}
        actions={
          <AppButton asChild>
            <Link to="/admin/cms/new">
              <PlusIcon className="size-4" />
              {createLabel}
            </Link>
          </AppButton>
        }
      />

      <div className="grid gap-4 rounded-xl border bg-card p-4 shadow-card md:grid-cols-3">
        <AppInput
          label="Search"
          placeholder="Search title, slug, or body..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <AppSelect
          label="Section"
          value={section}
          onValueChange={(value) => {
            setSection(value);
            setPage(1);
          }}
          options={sectionFilterOptions}
        />
        <AppSelect
          label="Status"
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={statusFilterOptions}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Unable to load CMS pages. Please try again.
        </div>
      ) : (
        <AppTable
          title={tableTitle}
          description={tableDescription}
          columns={columns}
          data={data?.pages ?? []}
          getRowKey={(row) => row.id}
          emptyIcon={FileTextIcon}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          footer={
            pagination ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
                </p>
                <div className="flex gap-2">
                  <AppButton
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </AppButton>
                  <AppButton
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
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
        title="Delete CMS content?"
        description={
          deleteTarget
            ? `This will permanently delete "${deleteTarget.title}". This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return;

          try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast.success('Content deleted successfully.');
            setDeleteTarget(null);
          } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to delete content.'));
          }
        }}
      />
    </div>
  );
}
