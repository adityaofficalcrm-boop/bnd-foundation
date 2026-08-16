import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addGalleryItem,
  createGalleryAlbum,
  deleteGalleryAlbum,
  deleteGalleryItem,
  fetchGalleryAlbum,
  fetchGalleryAlbums,
  fetchPublicGalleryAlbum,
  fetchPublicGalleryAlbums,
  updateGalleryAlbum,
} from '@/features/gallery/api/gallery.api';
import type { GalleryAlbumFormValues } from '@/features/gallery/schemas/gallery.schema';
import type {
  GalleryAlbumListParams,
  GalleryMediaType,
} from '@/features/gallery/types/gallery.types';

export const galleryQueryKeys = {
  all: ['gallery'] as const,
  list: (params: GalleryAlbumListParams) => [...galleryQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...galleryQueryKeys.all, 'detail', id] as const,
  public: () => [...galleryQueryKeys.all, 'public'] as const,
  publicSlug: (slug: string) => [...galleryQueryKeys.all, 'public', slug] as const,
};

export function useGalleryAlbums(params: GalleryAlbumListParams) {
  return useQuery({
    queryKey: galleryQueryKeys.list(params),
    queryFn: () => fetchGalleryAlbums(params),
  });
}

export function useGalleryAlbum(id: string | undefined) {
  return useQuery({
    queryKey: galleryQueryKeys.detail(id ?? ''),
    queryFn: () => fetchGalleryAlbum(id!),
    enabled: Boolean(id),
  });
}

export function useCreateGalleryAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GalleryAlbumFormValues) => createGalleryAlbum(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all }),
  });
}

export function useUpdateGalleryAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<GalleryAlbumFormValues> }) =>
      updateGalleryAlbum(id, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all }),
  });
}

export function useDeleteGalleryAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGalleryAlbum(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all }),
  });
}

export function useAddGalleryItem(albumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      mediaType: GalleryMediaType;
      url: string;
      title?: string;
      sortOrder?: number;
    }) => addGalleryItem(albumId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.detail(albumId) });
      void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all });
    },
  });
}

export function useDeleteGalleryItem(albumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => deleteGalleryItem(albumId, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.detail(albumId) });
      void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all });
    },
  });
}

export function usePublicGalleryAlbums() {
  return useQuery({
    queryKey: galleryQueryKeys.public(),
    queryFn: fetchPublicGalleryAlbums,
  });
}

export function usePublicGalleryAlbum(slug: string | undefined) {
  return useQuery({
    queryKey: galleryQueryKeys.publicSlug(slug ?? ''),
    queryFn: () => fetchPublicGalleryAlbum(slug!),
    enabled: Boolean(slug),
  });
}
