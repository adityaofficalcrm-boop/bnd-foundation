# BND Foundation Platform - Project Requirements

## Project Overview

This project is a complete rebuild of the existing BND Foundation website.

Existing Website:
https://bndfoundation.org

Current Website Technology:

* WordPress

New Technology:

* React
* Node.js
* MongoDB

This is not a WordPress migration.

The existing website should be used as:

* Content Reference
* Design Reference
* Page Structure Reference

The application should be modern, scalable, responsive, and easy for non-technical administrators to manage.

---

# Project Goals

1. Rebuild existing website using modern technologies.
2. Create Admin Dashboard.
3. Create Donation Management System.
4. Create Campaign Management System.
5. Create Team Management System.
6. Create Gallery Management System.
7. Support Multiple Languages.
8. Make all content manageable from Admin Panel.
9. Create scalable architecture for future growth.

---

# Budget Constraints

Project Type:

* Non-Profit Organization

Budget:

* NPR 50,000

Priority:

* Stability
* Maintainability
* Ease of Management

Avoid unnecessary enterprise complexity.

---

# Existing Website Analysis

Reference:
https://bndfoundation.org

Analyze and recreate:

* Homepage
* About Page
* Team Page
* Impact Page
* Donation Page
* Contact Page
* Gallery
* Footer
* Navigation

Improve UX while maintaining branding.

---

# Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* ShadCN UI
* React Router
* TanStack Query
* React Hook Form
* Zod
* Axios
* i18next
* Recharts

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose

## Authentication

* JWT
* Refresh Token

## Storage

* Cloudinary

## Database

* MongoDB Atlas

## Deployment

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

Domain:

* Namecheap Domain

---

# User Roles

## Super Admin

Can:

* Manage entire platform
* Manage admins
* Manage settings

## Admin

Can:

* Manage content
* Manage campaigns
* Manage members
* Manage gallery
* View donations

## Public User

Can:

* Browse website
* Contact foundation
* Donate
* Apply as volunteer

---

# Public Website Pages

## Home

Sections:

* Hero Section
* Mission
* Vision
* Statistics
* Programs
* Campaigns
* Testimonials
* Partners
* Donation CTA

## About

* Organization Information
* Mission
* Vision
* History

## Impact

* Success Stories
* Statistics
* Achievements

## Team

* Board Members
* Leadership Team
* Volunteers

## Campaigns

* Active Campaigns
* Completed Campaigns

## Donate

* Donation Form
* Donation Information

## Volunteer

* Volunteer Application Form

## Gallery

* Photos
* Albums

## Contact

* Contact Form
* Address
* Social Links

---

# Admin Dashboard

Create modern dashboard.

Display:

* Total Donations
* Monthly Donations
* Yearly Donations
* Total Donors
* Total Members
* Total Campaigns
* Contact Requests

Charts:

* Monthly Donations
* Campaign Performance
* Donation Growth

---

# Donation Management

Purpose:
Track all donations.

Fields:

* Donor Name
* Email
* Phone
* Country
* Amount
* Campaign
* Payment Status
* Transaction ID
* Created Date

Features:

* View Donations
* Search Donations
* Filter Donations
* Export CSV
* Export Excel

Note:
There is currently no donation data to migrate.

Build system for future donations.

Prepare architecture for Stripe integration.

---

# Campaign Management

Admin can:

* Create Campaign
* Edit Campaign
* Delete Campaign
* Publish Campaign

Fields:

* Title
* Description
* Goal Amount
* Raised Amount
* Cover Image
* Status
* Start Date
* End Date

---

# Team Management

Admin can:

* Add Member
* Edit Member
* Delete Member

Fields:

* Name
* Position
* Biography
* Image
* Email
* LinkedIn
* Country Chapter

---

# Gallery Management

Admin can:

* Upload Images
* Delete Images
* Create Albums

Storage:

* Cloudinary

---

# Testimonial Management

Admin can:

* Add Testimonial
* Edit Testimonial
* Delete Testimonial

---

# Contact Management

Admin can:

* View Messages
* Mark Resolved
* Delete Messages

---

# CMS Management

All website content must be dynamic.

Do NOT hardcode content.

Admin should manage:

* Homepage Content
* About Content
* Impact Content
* Statistics
* Footer Content
* Contact Information

Store content in MongoDB.

---

# Website Settings

Admin can manage:

* Logo
* Favicon
* Address
* Email
* Phone
* Social Media Links
* SEO Settings

---

# Multi-Language Support

Languages:

1. English
2. Nepali

Requirements:

* Language Switcher
* Persistent Language Selection
* i18next Integration

Future Languages:

* Hindi
* Japanese
* Korean

Architecture should support future additions.

---

# Database Collections

users

admins

donations

campaigns

members

gallery

testimonials

contacts

cms_pages

settings

audit_logs

---

# Security Requirements

Implement:

* Helmet
* Rate Limiting
* JWT Authentication
* Password Hashing
* Environment Variables
* Input Validation
* Secure API Design

---

# SEO Requirements

Implement:

* Dynamic Meta Tags
* Sitemap
* Robots.txt
* Open Graph Tags
* Structured Data
* Canonical URLs

---

# Architecture Requirements

Use:

* Clean Architecture
* SOLID Principles
* Feature-Based Structure
* Repository Pattern
* Service Layer
* DTO Validation
* Reusable Components

---

# Development Phases

Phase 1

* Monorepo Setup

Phase 2

* Backend Architecture

Phase 3

* Authentication

Phase 4

* Public Website

Phase 5

* Admin Dashboard

Phase 6

* CMS Management

Phase 7

* Team Management

Phase 8

* Campaign Management

Phase 9

* Donation Management

Phase 10

* Multi-Language Support

Phase 11

* Testing

Phase 12

* Deployment

Cursor should complete one phase at a time and explain architectural decisions before generating code.
