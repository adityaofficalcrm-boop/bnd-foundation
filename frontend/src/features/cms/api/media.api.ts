import { apiClient } from '@/lib/api';

type UploadMediaResponse = {
  url: string;
  filename: string;
};

export async function uploadMedia(file: File): Promise<UploadMediaResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<{ success: true; data: UploadMediaResponse }>(
    '/media/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return data.data;
}
