import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent } from "@/components/ds/section";
import { getPublishedPage } from "@/features/pages/api/pages-api";

type PublicCustomPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicCustomPage({
  params,
}: PublicCustomPageProps) {
  const { slug } = await params;

  try {
    const page = await getPublishedPage(slug);

    return (
      <PublicShell>
        <PageHeader>
          <PageTitle>{page.title}</PageTitle>
          {page.excerpt && <PageDescription>{page.excerpt}</PageDescription>}
        </PageHeader>

        <Section>
          <SectionContent className="text-foreground whitespace-pre-wrap">
            {page.content}
          </SectionContent>
        </Section>
      </PublicShell>
    );
  } catch {
    notFound();
  }
}
