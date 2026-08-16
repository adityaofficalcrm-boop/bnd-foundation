import axios from 'axios';
import { env } from '@/config/env';
import type { GalleryAlbumFormValues } from '@/features/gallery/schemas/gallery.schema';
import type {
  ApiSuccessResponse,
  GalleryAlbum,
  GalleryAlbumDetail,
  GalleryAlbumListParams,
  GalleryItem,
  GalleryMediaType,
  PaginationMeta,
} from '@/features/gallery/types/gallery.types';
import { apiClient } from '@/lib/api';

const publicApiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchGalleryAlbums(params: GalleryAlbumListParams = {}) {
  const { data } = await apiClient.get<ApiSuccessResponse<GalleryAlbum[]>>('/gallery', { params });
  return {
    albums: data.data,
    pagination: data.meta?.pagination as PaginationMeta,
  };
}

export async function fetchGalleryAlbum(id: string) {
  const { data } = await apiClient.get<ApiSuccessResponse<GalleryAlbumDetail>>(`/gallery/${id}`);
  return data.data;
}

export async function createGalleryAlbum(payload: GalleryAlbumFormValues) {
  const { data } = await apiClient.post<ApiSuccessResponse<GalleryAlbum>>('/gallery', payload);
  return data.data;
}

export async function updateGalleryAlbum(id: string, payload: Partial<GalleryAlbumFormValues>) {
  const { data } = await apiClient.put<ApiSuccessResponse<GalleryAlbum>>(`/gallery/${id}`, payload);
  return data.data;
}

export async function deleteGalleryAlbum(id: string) {
  await apiClient.delete(`/gallery/${id}`);
}

export async function addGalleryItem(
  albumId: string,
  payload: { mediaType: GalleryMediaType; url: string; title?: string; sortOrder?: number },
) {
  const { data } = await apiClient.post<ApiSuccessResponse<GalleryItem>>(
    `/gallery/${albumId}/items`,
    payload,
  );
  return data.data;
}

export async function deleteGalleryItem(albumId: string, itemId: string) {
  await apiClient.delete(`/gallery/${albumId}/items/${itemId}`);
}

export async function fetchPublicGalleryAlbums() {
  const { data } = await publicApiClient.get<ApiSuccessResponse<GalleryAlbum[]>>('/gallery/public');
  return data.data;
}

export async function fetchPublicGalleryAlbum(slug: string) {
  const { data } = await publicApiClient.get<ApiSuccessResponse<GalleryAlbumDetail>>(
    `/gallery/public/${slug}`,
  );
  return data.data;
}

export async function uploadGalleryVideo(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<{
    success: true;
    data: { url: string; filename: string; mediaType: string };
  }>('/media/upload-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
}
