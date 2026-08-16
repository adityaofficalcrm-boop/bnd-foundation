import { CmsBodyContent } from '@/features/public-cms/components/CmsBodyContent';
import { hasMeaningfulCmsBody } from '@/features/public-site/utils/team-content-slugs';

type TeamPageIntroProps = {
  title: string;
  description?: string | null;
  body?: string | null;
};

export function TeamPageIntro({ title, description, body }: TeamPageIntroProps) {
  return (
    <header className="mx-auto max-w-3xl space-y-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">{title}</h2>
      {description?.trim() ? (
        <p className="text-sm text-muted-foreground md:text-base">{description.trim()}</p>
      ) : null}
      {body && hasMeaningfulCmsBody(body) ? (
        <CmsBodyContent body={body} className="text-base leading-relaxed text-muted-foreground md:text-lg" />
      ) : null}
    </header>
  );
}
