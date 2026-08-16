import { CmsListPage } from '@/pages/admin/cms/CmsListPage';
import { CMS_SECTIONS } from '@/features/cms/types/cms.types';

/**
 * Team members are CMS entries (slugs like team-*, team-page, team-cta).
 * This page is a focused CMS view — same create/edit flow as /admin/cms.
 */
export function TeamMembersPage() {
  return (
    <CmsListPage
      eyebrow="People"
      title="Team members"
      description="Profiles and page copy for /team and the About board section. Use team-* slugs (e.g. team-kamala-board) and set Role + Group in meta."
      breadcrumbLabel="Team"
      tableTitle="Team CMS entries"
      tableDescription="Filtered to About Us content matching “team”. Clear search to see the full About section."
      emptyTitle="No team entries yet"
      emptyDescription="Create a CMS entry with a team-* slug (About Us section) to list members on the public team page."
      createLabel="Add team content"
      defaultSearch="team"
      defaultSection={CMS_SECTIONS.ABOUT_US}
    />
  );
}
