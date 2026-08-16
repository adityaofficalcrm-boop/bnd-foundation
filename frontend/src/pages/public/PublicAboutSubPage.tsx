import { Navigate, useParams } from 'react-router-dom';
import { isAboutSubpageSlug } from '@/config/public-nav';
import { PublicAboutPageView } from '@/features/public-cms/components/PublicAboutPageView';
import { PublicDonorsPageView } from '@/features/public-cms/components/PublicDonorsPageView';
import { PublicHistoryPageView } from '@/features/public-cms/components/PublicHistoryPageView';
import { PublicImpactPageView } from '@/features/public-cms/components/PublicImpactPageView';

export function PublicAboutIndexPage() {
  return <PublicAboutPageView />;
}

export function PublicAboutSubPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !isAboutSubpageSlug(slug)) {
    return <Navigate to="/about/history" replace />;
  }

  if (slug === 'history') {
    return <PublicHistoryPageView />;
  }

  if (slug === 'impact') {
    return <PublicImpactPageView />;
  }

  if (slug === 'donors') {
    return <PublicDonorsPageView />;
  }

  return <Navigate to="/about/history" replace />;
}
