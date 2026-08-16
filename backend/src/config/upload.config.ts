import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const UPLOAD_DIR = path.join(backendRoot, 'uploads');

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export const ALLOWED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
]);

/** Images — 5 MB */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Short videos — 80 MB (for a few short clips) */
export const MAX_VIDEO_UPLOAD_BYTES = 80 * 1024 * 1024;

export function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}
