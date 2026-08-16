import path from 'node:path';
import type { Request } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { ALLOWED_IMAGE_MIME_TYPES, ALLOWED_VIDEO_MIME_TYPES, MAX_UPLOAD_BYTES, MAX_VIDEO_UPLOAD_BYTES, UPLOAD_DIR, ensureUploadDir } from '../config/upload.config.js';

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.bin';
    cb(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
    cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'));
    return;
  }

  cb(null, true);
}

function videoFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (!ALLOWED_VIDEO_MIME_TYPES.has(file.mimetype)) {
    cb(new Error('Only MP4 and WEBM videos are allowed'));
    return;
  }

  cb(null, true);
}

export const imageUpload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: imageFileFilter,
});

export const videoUpload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_UPLOAD_BYTES },
  fileFilter: videoFileFilter,
});
