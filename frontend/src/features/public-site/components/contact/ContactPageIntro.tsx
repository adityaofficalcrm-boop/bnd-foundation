type ContactPageIntroProps = {
  title: string;
  description?: string | null;
};

export function ContactPageIntro({ title, description }: ContactPageIntroProps) {
  return (
    <header className="mx-auto max-w-3xl space-y-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">{title}</h1>
      {description?.trim() ? (
        <p className="text-base text-muted-foreground md:text-lg">{description.trim()}</p>
      ) : null}
    </header>
  );
}
