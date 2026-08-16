import type { Request, Response } from 'express';
import { BaseController } from './BaseController.js';
import { BadRequestError } from '../errors/BadRequestError.js';

export class MediaController extends BaseController {
  uploadImage = (req: Request, res: Response): void => {
    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }

    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    this.sendCreated(
      res,
      { url: publicUrl, filename: req.file.filename, mediaType: 'IMAGE' },
      'Image uploaded successfully',
    );
  };

  uploadVideo = (req: Request, res: Response): void => {
    if (!req.file) {
      throw new BadRequestError('No video file provided');
    }

    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    this.sendCreated(
      res,
      { url: publicUrl, filename: req.file.filename, mediaType: 'VIDEO' },
      'Video uploaded successfully',
    );
  };
}

export const mediaController = new MediaController();
