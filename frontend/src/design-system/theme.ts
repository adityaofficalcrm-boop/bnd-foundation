/**
 * BND Foundation Design System — Theme Configuration
 * Source of truth: DESIGN_SYSTEM.md
 */

export const theme = {
  colors: {
    primary: '#0F4C81',
    secondary: '#2E8B57',
    accent: '#F4B400',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    headingWeight: 600,
    bodyWeight: 400,
    lineHeight: 1.5,
  },
  layout: {
    contentMaxWidth: 1440,
    sidebarWidth: 280,
    contentPaddingDesktop: 24,
    contentPaddingMobile: 16,
    gridColumns: 12,
  },
  radius: {
    sm: '0.375rem',
    md: '0.625rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadow: {
    card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
    elevated: '0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06)',
  },
} as const;

export type Theme = typeof theme;
