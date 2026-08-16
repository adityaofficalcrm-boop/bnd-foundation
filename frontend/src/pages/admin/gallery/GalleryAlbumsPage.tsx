import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
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
  useDeleteGalleryAlbum,
  useGalleryAlbums,
} from '@/features/gallery/hooks/useGalleryQueries';
import {
  GALLERY_ALBUM_STATUSES,
  GALLERY_ALBUM_STATUS_LABELS,
  type GalleryAlbum,
  type GalleryAlbumStatus,
} from '@/features/gallery/types/gallery.types';
import { getApiErrorMessage } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

const statusFilterOptions = [
  { value: 'ALL', label: 'All statuses' },
  ...Object.values(GALLERY_ALBUM_STATUSES).map((value) => ({
    value,
    label: GALLERY_ALBUM_STATUS_LABELS[value],
  })),
];

function StatusPill({ status }: { status: GalleryAlbumStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        status === GALLERY_ALBUM_STATUSES.PUBLISHED
          ? 'bg-success/15 text-success'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {GALLERY_ALBUM_STATUS_LABELS[status]}
    </span>
  );
}

export function GalleryAlbumsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<GalleryAlbum | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === 'ALL' ? undefined : (status as GalleryAlbumStatus),
    }),
    [page, search, status],
  );

  const { data, isLoading, isError } = useGalleryAlbums(listParams);
  const deleteMutation = useDeleteGalleryAlbum();

  const columns: AppTableColumn<GalleryAlbum>[] = [
    {
      key: 'title',
      header: 'Album',
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'itemCount',
      header: 'Media',
      cell: (row) => `${row.itemCount ?? 0} item${(row.itemCount ?? 0) === 1 ? '' : 's'}`,
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
            <Link to={`/admin/gallery/${row.id}/edit`}>
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
      toast.success('Album deleted');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Create albums and upload photos or short videos (stored on our server)."
        actions={
          <AppButton asChild variant="primary">
            <Link to="/admin/gallery/new">
              <PlusIcon className="size-4" />
              New album
            </Link>
          </AppButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
        <AppInput
          label="Search"
          placeholder="Search albums..."
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
        <p className="text-sm text-destructive">Unable to load albums.</p>
      ) : (
        <AppTable
          title="All albums"
          description="Published albums appear on /gallery."
          columns={columns}
          data={data?.albums ?? []}
          getRowKey={(row) => row.id}
          emptyTitle="No albums yet"
          emptyDescription="Create an album, then upload a few images or short videos."
          emptyIcon={ImageIcon}
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
        title="Delete album?"
        description={
          deleteTarget
            ? `This deletes “${deleteTarget.title}” and all media items in it.`
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
