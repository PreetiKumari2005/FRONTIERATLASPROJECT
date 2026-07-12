export const runtime = "edge";

import PapersPageContent from "@/components/PapersPageContent";
import { getPapers, searchPapers } from "@/lib/paperApi";

export const dynamic = "force-dynamic";

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const initialQuery = q?.trim() ?? "";

  try {
    const initialPapers = initialQuery
      ? await searchPapers(initialQuery).then((papers) => ({
          papers,
          total: papers.length,
          page: 1,
          limit: 20,
          hasMore: false,
        }))
      : await getPapers({ page: 1, sort: "latest", period: "all" });

    return (
      <PapersPageContent
        initialPapers={initialPapers}
        initialQuery={initialQuery}
      />
    );
  } catch {
    return (
      <PapersPageContent
        initialPapers={null}
        initialQuery={initialQuery}
        initialError="Failed to load papers. Please try again later."
      />
    );
  }
}
