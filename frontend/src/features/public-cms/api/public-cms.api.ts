import axios from 'axios';
import { env } from '@/config/env';
import type { CmsSection } from '@/features/cms/types/cms.types';
import type { CmsPublicPage, PublicApiSuccessResponse } from '@/features/public-cms/types/public-cms.types';

const publicApiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchPublicCmsAll(): Promise<CmsPublicPage[]> {
  const { data } = await publicApiClient.get<PublicApiSuccessResponse<CmsPublicPage[]>>('/cms/public');
  return data.data;
}

export async function fetchPublicCmsBySection(section: CmsSection): Promise<CmsPublicPage[]> {
  const { data } = await publicApiClient.get<PublicApiSuccessResponse<CmsPublicPage[]>>(
    `/cms/public/${section}`,
  );
  return data.data;
}
