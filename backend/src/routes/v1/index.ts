import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { campaignRouter } from './campaign.routes.js';
import { cmsRouter } from './cms.routes.js';
import { contactRouter } from './contact.routes.js';
import { dashboardRouter } from './dashboard.routes.js';
import { donationRouter } from './donation.routes.js';
import { galleryRouter } from './gallery.routes.js';
import { healthRouter } from './health.routes.js';
import { mediaRouter } from './media.routes.js';
import { volunteerRouter } from './volunteer.routes.js';

export const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/campaigns', campaignRouter);
v1Router.use('/cms', cmsRouter);
v1Router.use('/contact', contactRouter);
v1Router.use('/dashboard', dashboardRouter);
v1Router.use('/donations', donationRouter);
v1Router.use('/gallery', galleryRouter);
v1Router.use('/media', mediaRouter);
v1Router.use('/volunteers', volunteerRouter);
