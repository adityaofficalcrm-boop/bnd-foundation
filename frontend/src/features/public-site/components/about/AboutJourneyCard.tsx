import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import type { CmsPublicPage } from '@/features/public-cms/types/public-cms.types';
import { PageContainer } from '@/features/public-site/components/PageContainer';

type AboutJourneyCardProps = {
  entry: CmsPublicPage;
  rightPortrait?: CmsPublicPage | null;
  signature?: CmsPublicPage | null;
};

function JourneySignature({ signatureEntry }: { signatureEntry?: CmsPublicPage | null }) {
  const signatureImage = signatureEntry?.imageUrl;

  if (!signatureImage) {
    return null;
  }

  const altText = signatureEntry?.title?.trim() || 'Founders signature';

  return (
    <img
      src={signatureImage}
      alt={altText}
      className="mt-6 max-h-16 w-auto max-w-[240px] object-contain object-left"
      loading="lazy"
    />
  );
}

export function AboutJourneyCard({ entry, rightPortrait, signature }: AboutJourneyCardProps) {
  const leftImage = entry.imageUrl;
  const rightImage = rightPortrait?.imageUrl;

  return (
    <section className="relative overflow-hidden bg-primary/95 py-12 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
        style={leftImage ? { backgroundImage: `url(${leftImage})` } : undefined}
        aria-hidden="true"
      />
      <PageContainer className="relative">
        <div className="overflow-hidden rounded-2xl bg-card shadow-elevated">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_1.4fr_minmax(0,1fr)]">
            {leftImage ? (
              <div className="relative min-h-[220px] lg:min-h-[420px]">
                <img src={leftImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="hidden bg-muted lg:block" aria-hidden="true" />
            )}

            <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-12">
              {entry.heading ? (
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{entry.heading}</p>
              ) : null}
              <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl lg:text-[1.65rem]">
                {entry.title}
              </h2>
              <CmsBodyContent
                body={entry.body}
                className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base"
              />
              <JourneySignature signatureEntry={signature} />
            </div>

            {rightImage ? (
              <div className="relative min-h-[220px] lg:min-h-[420px]">
                <img src={rightImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="hidden bg-muted lg:block" aria-hidden="true" />
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
