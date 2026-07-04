"use client";

import {
  ExternalLink,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  Globe,
  FileText,
  Sparkles,
  Github,
  Trophy,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  Quote,
  Tag,
  Star,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect, type ReactNode } from "react";
import type { PaperDetail as PaperDetailType } from "@/lib/papers";
import { getPapers, type Paper } from "@/lib/paperApi";
import { atlasUiFont } from "@/lib/fonts";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getCitationYear(dateStr: string | null): string {
  if (!dateStr) return "n.d.";
  try {
    return new Date(dateStr).getFullYear().toString();
  } catch {
    return "n.d.";
  }
}

function formatCompactNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

type CitationFormat = "apa" | "mla" | "chicago";
type ChipVariant = "tasks" | "methods" | "models" | "datasets";

function generateCitation(paper: PaperDetailType, format: CitationFormat): string {
  const year = getCitationYear(paper.publicationDate);
  const authors = paper.authors.map((pa) => pa.author.name);
  const authorStr = authors.length > 0 ? authors.join(", ") : "Unknown Author";
  const title = paper.title;
  const doi = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const arxiv = paper.arxivId ? `arXiv:${paper.arxivId}` : null;
  const source = arxiv || "Online";

  switch (format) {
    case "apa":
      return `${authorStr} (${year}). ${title}. ${source}.${doi ? ` https://doi.org/${paper.doi}` : ""}`;
    case "mla":
      return `${authorStr}. "${title}." ${source}, ${year}.${doi ? ` doi:${paper.doi}.` : ""}`;
    case "chicago":
      return `${authorStr}. ${year}. "${title}." ${source}.${doi ? ` https://doi.org/${paper.doi}.` : ""}`;
  }
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-[#E5E5E0] bg-white ${className}`}>{children}</div>;
}

function Section({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#ECE7DD] pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold tracking-tight text-[#111111]">{title}</h2>
        {meta ? <div className="text-[11px] text-[#8B8B8B]">{meta}</div> : null}
      </div>
      {children}
    </section>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="overflow-hidden rounded-xl">
      <div className="border-b border-[#EFECE6] px-4 py-3.5">
        <h3 className="text-[12px] font-bold tracking-tight text-[#444444]">{title}</h3>
      </div>
      <div className="px-4 py-4">{children}</div>
    </Card>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-[#ECE9E3] bg-[#FBFBF9] px-3 py-3">
      <div className="mt-0.5 shrink-0 text-[#8B8B8B]">{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B8B8B]">{label}</div>
        <div className="mt-0.5 text-[13px] font-medium leading-5 text-[#222222]">{value}</div>
      </div>
    </div>
  );
}

function ActionLink({
  href,
  icon,
  label,
}: {
  href?: string | null;
  icon: ReactNode;
  label: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E0] bg-white px-4 py-2 text-[12px] font-medium text-[#111111] no-underline transition-colors hover:bg-[#FFF7F3] hover:text-[#F55036] [&_svg]:text-[#F55036]"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function TaxonomyLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: ChipVariant;
}) {
  const tone = {
    tasks: "border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]",
    methods: "border-[#D8B4FE] bg-[#F3E8FF] text-[#6B21A8]",
    models: "border-[#E5E5E0] bg-white text-[#111111]",
    datasets: "border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1]",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[12px] font-medium no-underline transition-opacity hover:opacity-85 ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </Link>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[90px_minmax(0,1fr)] gap-3 border-b border-[#EFECE6] py-2.5 last:border-b-0 last:pb-0 first:pt-0">
      <span className="text-[12px] text-[#666666]">{label}</span>
      <div className="min-w-0 text-right text-[13px] leading-6 text-[#111111] break-words">{value}</div>
    </div>
  );
}

function HeroPreview({ paper, previewHref }: { paper: PaperDetailType; previewHref: string | null }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showThumbnail = !!paper.thumbnailUrl && !imageFailed;

  return (
    <div className="w-full max-w-[252px] self-start justify-self-start xl:justify-self-end xl:pt-[42px]">
      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B8B8B]">
        <span>Paper Preview</span>
        {previewHref ? (
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6E665D] no-underline transition-colors hover:text-[#F55036]"
          >
            Open
            <ExternalLink size={11} />
          </a>
        ) : null}
      </div>

      {previewHref ? (
        <a href={previewHref} target="_blank" rel="noopener noreferrer" className="group block no-underline">
          {showThumbnail ? (
            <div className="overflow-hidden rounded-[22px] border border-[#E5E5E0] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.06)] transition-transform duration-200 group-hover:-translate-y-0.5">
              <img
                src={paper.thumbnailUrl!}
                alt={`Preview of ${paper.title}`}
                className="aspect-[3/4] h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                onError={() => setImageFailed(true)}
              />
            </div>
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center rounded-[22px] border border-dashed border-[#D9CEC0] bg-white px-6 text-center text-[13px] text-[#94897A] shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition-colors duration-200 group-hover:border-[#F2B7A7] group-hover:text-[#6E665D]">
              Open paper preview
            </div>
          )}
        </a>
      ) : showThumbnail ? (
        <div className="overflow-hidden rounded-[22px] border border-[#E5E5E0] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.06)]">
          <img
            src={paper.thumbnailUrl!}
            alt={`Preview of ${paper.title}`}
            className="aspect-[3/4] h-auto w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : null}
    </div>
  );
}

function RelatedPaperCard({ paper }: { paper: Paper }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = !!paper.thumbnail && !thumbnailFailed;

  return (
    <Link
      href={`/papers/${paper.slug || paper.id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-[#E5E5E0] bg-[#FFFEFC] no-underline transition-all hover:border-[#F2B7A7] hover:bg-[#FFF8F5] hover:shadow-[0_8px_24px_rgba(17,17,17,0.05)] ${showThumbnail ? "" : "p-3.5"}`}
    >
      {showThumbnail ? (
        <div className="border-b border-[#EFEAE1] bg-[#FBFAF7] p-2.5">
          <div className="overflow-hidden rounded-lg border border-[#E5E5E0] bg-white">
            <img
              src={paper.thumbnail}
              alt={`Preview of ${paper.title}`}
              className="aspect-[1.45/1] h-auto w-full object-contain bg-white transition-transform duration-200 group-hover:scale-[1.01]"
              onError={() => setThumbnailFailed(true)}
            />
          </div>
        </div>
      ) : null}

      <div className={`flex flex-1 flex-col ${showThumbnail ? "p-3.5" : ""}`}>
        <h4 className="text-[15px] font-semibold leading-[1.45] text-[#1F1A15] transition-colors group-hover:text-[#F55036]">
          {paper.title}
        </h4>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-[#666056]">{paper.authors}</p>
        {paper.date ? <p className="mt-3 text-[12px] text-[#928879]">{paper.date}</p> : null}
      </div>
    </Link>
  );
}

export default function PaperDetail({ paper }: { paper: PaperDetailType }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [citationCopied, setCitationCopied] = useState<string | null>(null);
  const [abstractExpanded, setAbstractExpanded] = useState(false);
  const [relatedPapers, setRelatedPapers] = useState<Paper[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const arxivUrl = paper.arxivId ? `https://arxiv.org/abs/${paper.arxivId}` : null;
  const doiUrl = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const previewHref =
    paper.pdfUrl || paper.paperUrl || arxivUrl || doiUrl || paper.sourceUrl || paper.projectUrl;
  const showHeroPreview = !!paper.thumbnailUrl || !!previewHref;
  const abstractTruncated = !!paper.abstract && paper.abstract.length > 560;

  const hasGitHubStats =
    (paper.githubStars != null && paper.githubStars > 0) ||
    (paper.githubForks != null && paper.githubForks > 0);
  const hasGitHub = !!paper.githubUrl || hasGitHubStats || paper.isOfficialCode != null;
  const showHuggingFace = paper.hfUpvotes != null && paper.hfUpvotes > 0;

  const hasPaperDetails =
    !!paper.publicationDate ||
    !!paper.submissionDate ||
    paper.conferences.length > 0 ||
    !!paper.arxivId ||
    !!paper.doi ||
    !!paper.paperType ||
    !!paper.status ||
    !!paper.language ||
    !!paper.license ||
    paper.pageCount != null ||
    paper.citationCount > 0 ||
    paper.referenceCount > 0 ||
    !!paper.discoverySource ||
    !!paper.createdAt ||
    !!paper.updatedAt ||
    (paper.trendingScore != null && paper.trendingScore > 0) ||
    !!paper.slug;

  const hasPrimaryContent =
    !!paper.tlDr ||
    !!paper.abstract ||
    paper.tasks.length > 0 ||
    paper.methods.length > 0 ||
    paper.models.length > 0 ||
    paper.datasets.length > 0 ||
    paper.rankings.length > 0 ||
    paper.sotaClaims.length > 0 ||
    !!paper.shortTitle ||
    !!paper.paperType ||
    !!paper.language ||
    !!paper.license ||
    !!paper.status ||
    paper.pageCount != null ||
    paper.referenceCount > 0 ||
    !!paper.discoverySource;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: paper.title, url: window.location.href });
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      } catch {
        // ignore
      }
    } else {
      handleCopyLink();
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    }
  }, [paper.title, handleCopyLink]);

  const handleCopyCitation = useCallback(
    async (format: CitationFormat) => {
      const text = generateCitation(paper, format);
      try {
        await navigator.clipboard.writeText(text);
        setCitationCopied(format);
        setTimeout(() => setCitationCopied(null), 2000);
      } catch {
        // ignore
      }
    },
    [paper]
  );

  useEffect(() => {
    async function loadRelated() {
      if (paper.tasks.length === 0) {
        setRelatedLoading(false);
        return;
      }

      try {
        const taskSlug = paper.tasks[0].task.slug;
        const result = await getPapers({ page: 1, task: taskSlug });
        setRelatedPapers(
          result.papers.filter((p) => String(p.id) !== String(paper.id)).slice(0, 4)
        );
      } catch {
        // ignore
      }

      setRelatedLoading(false);
    }

    loadRelated();
  }, [paper]);

  const citationFormats: { key: CitationFormat; label: string }[] = [
    { key: "apa", label: "APA" },
    { key: "mla", label: "MLA" },
    { key: "chicago", label: "Chicago" },
  ];

  return (
    <div className={`${atlasUiFont.className} bg-[#F8F7F2] text-[#111111] tracking-normal`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12pt; color: #000; background: #fff; }
          a { color: #000 !important; text-decoration: underline !important; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1500px] px-4 py-4 md:px-6 lg:px-8">
        <nav className="no-print mb-3 flex items-center gap-2 text-[12px] text-[#7B7166]">
          <Link href="/" className="no-underline transition-colors hover:text-[#F55036]">
            Home
          </Link>
          <span>›</span>
          <Link href="/" className="no-underline transition-colors hover:text-[#F55036]">
            Papers
          </Link>
          <span>›</span>
          <span className="truncate text-[#555555]">{paper.title}</span>
        </nav>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_312px] xl:gap-5">
          <main className="min-w-0 self-start">
            <Card className="p-5 md:p-6">
              <div className={`grid gap-4 ${showHeroPreview ? "xl:grid-cols-[minmax(0,1.48fr)_minmax(220px,252px)] xl:items-start" : ""}`}>
                <div className="min-w-0">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B8B8B]">
                    <span className="rounded-full bg-[#FFF0EA] px-2.5 py-1 text-[#F55036]">Research Paper</span>
                    {paper.arxivId ? <span>arXiv: {paper.arxivId}</span> : null}
                  </div>

                  <h1 className="text-[30px] font-bold leading-[1.12] tracking-[-0.03em] text-[#111111] md:text-[38px] xl:text-[40px]">
                    {paper.title}
                  </h1>

                  {paper.authors.length > 0 ? (
                    <div className="mt-3.5 flex flex-wrap gap-x-1 gap-y-0.5 text-[14px] leading-6 text-[#555555]">
                      {paper.authors.map((pa, i) => (
                        <span key={pa.author.id}>
                          {i > 0 ? <span className="text-[#AAA093]">· </span> : null}
                          <Link
                            href={`/authors/${pa.author.slug}`}
                            className="font-medium text-[#555555] no-underline transition-colors hover:text-[#F55036]"
                          >
                            {pa.author.name}
                          </Link>
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="no-print mt-3.5 flex flex-wrap gap-2.5">
                    <ActionLink href={paper.pdfUrl} icon={<FileText size={14} />} label="PDF" />
                    <ActionLink href={arxivUrl} icon={<Globe size={14} />} label="arXiv" />
                    <ActionLink href={paper.githubUrl} icon={<Github size={14} />} label="Code" />
                    <ActionLink href={paper.projectUrl} icon={<ExternalLink size={14} />} label="Project" />
                    <button
                      onClick={handleShare}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium transition-colors ${
                        shared
                          ? "border-[#F55036] bg-[#F55036] text-white"
                          : "border-[#E5E5E0] bg-white text-[#111111] hover:bg-[#FFF7F3] hover:text-[#F55036]"
                      }`}
                    >
                      <Share2 size={14} />
                      {shared ? "Shared" : "Share"}
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium transition-colors ${
                        copied
                          ? "border-[#F55036] bg-[#FFF7F3] text-[#F55036]"
                          : "border-[#E5E5E0] bg-white text-[#111111] hover:bg-[#FFF7F3] hover:text-[#F55036]"
                      }`}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy link"}
                    </button>
                    <button
                      onClick={() => handleCopyCitation("apa")}
                      className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E0] bg-white px-4 py-2 text-[12px] font-medium text-[#111111] transition-colors hover:bg-[#FFF7F3] hover:text-[#F55036]"
                    >
                      <Copy size={14} />
                      Cite
                    </button>
                  </div>
                </div>

                {showHeroPreview ? <HeroPreview paper={paper} previewHref={previewHref} /> : null}

                <div className={`grid gap-3 border-t border-[#EFEAE1] pt-4 sm:grid-cols-2 lg:grid-cols-5 ${showHeroPreview ? "xl:col-span-2" : ""}`}>
                  {paper.publicationDate ? (
                    <InfoTile icon={<Calendar size={13} />} label="Published" value={formatDate(paper.publicationDate)} />
                  ) : null}
                  {paper.conferences.length > 0 ? (
                    <InfoTile
                      icon={<BookOpen size={13} />}
                      label="Venue"
                      value={paper.conferences.map((pc) => pc.conference.name).join(", ")}
                    />
                  ) : null}
                  {paper.citationCount > 0 ? (
                    <InfoTile icon={<Quote size={13} />} label="Citations" value={paper.citationCount} />
                  ) : null}
                  {paper.paperType ? (
                    <InfoTile icon={<Tag size={13} />} label="Paper Type" value={paper.paperType} />
                  ) : null}
                  {paper.license ? (
                    <InfoTile icon={<FileText size={13} />} label="License" value={paper.license} />
                  ) : null}
                </div>
              </div>

              <div className="mt-[18px] space-y-5">
                {paper.abstract ? (
                  <Section title="Abstract">
                    <div className="relative text-[15px] leading-8 text-[#322C25]">
                      <div className={abstractExpanded ? "" : "max-h-[240px] overflow-hidden"}>
                        <p className="whitespace-pre-line">{paper.abstract}</p>
                      </div>
                      {abstractTruncated && !abstractExpanded ? (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                      ) : null}
                    </div>
                    {abstractTruncated ? (
                      <button
                        onClick={() => setAbstractExpanded((prev) => !prev)}
                        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4A7AA0] hover:text-[#2C5B84]"
                      >
                        {abstractExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {abstractExpanded ? "Read less" : "Read more"}
                      </button>
                    ) : null}
                  </Section>
                ) : null}

                {paper.tlDr ? (
                  <Section title="AI Summary">
                    <div className="rounded-lg border border-[#F0DECF] bg-[#FFF9F4] p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF0E8] text-[#F55036]">
                          <Sparkles size={16} />
                        </div>
                        <p className="text-[14px] leading-7 text-[#3A332C]">{paper.tlDr}</p>
                      </div>
                    </div>
                  </Section>
                ) : null}

                {paper.tasks.length > 0 ? (
                  <Section title="Tasks">
                    <div className="flex flex-wrap gap-2">
                      {paper.tasks.map((item) => (
                        <TaxonomyLink
                          key={item.task.id}
                          href={`/tasks/${item.task.slug}`}
                          label={item.task.name}
                          variant="tasks"
                        />
                      ))}
                    </div>
                  </Section>
                ) : null}

                {paper.methods.length > 0 ? (
                  <Section title="Methods">
                    <div className="flex flex-wrap gap-2">
                      {paper.methods.map((item) => (
                        <TaxonomyLink
                          key={item.method.id}
                          href={`/methods/${item.method.slug}`}
                          label={item.method.name}
                          variant="methods"
                        />
                      ))}
                    </div>
                  </Section>
                ) : null}

                {paper.models.length > 0 ? (
                  <Section title="Models">
                    <div className="flex flex-wrap gap-2">
                      {paper.models.map((item) => (
                        <TaxonomyLink
                          key={item.model.id}
                          href={`/models/${item.model.slug}`}
                          label={item.model.name}
                          variant="models"
                        />
                      ))}
                    </div>
                  </Section>
                ) : null}

                {paper.datasets.length > 0 ? (
                  <Section title="Datasets">
                    <div className="flex flex-wrap gap-2">
                      {paper.datasets.map((item) => (
                        <TaxonomyLink
                          key={item.dataset.id}
                          href={`/datasets/${item.dataset.slug}`}
                          label={item.dataset.name}
                          variant="datasets"
                        />
                      ))}
                    </div>
                  </Section>
                ) : null}

                {paper.rankings.length > 0 ? (
                  <Section title="Benchmarks" meta={<span>{paper.rankings.length} results</span>}>
                    <div className="overflow-hidden rounded-lg border border-[#E5E5E0] bg-white">
                      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_100px_80px_100px] gap-3 border-b border-[#EDE8DF] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B8B8B]">
                        <span>Benchmark</span>
                        <span>Model</span>
                        <span>Metric</span>
                        <span>Rank</span>
                        <span className="text-right">Compare</span>
                      </div>
                      {paper.rankings.map((ranking) => (
                        <div
                          key={ranking.id}
                          className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_100px_80px_100px] gap-3 border-b border-[#F2EEE6] px-4 py-4 text-[13px] text-[#111111] last:border-b-0"
                        >
                          <div className="font-medium">{ranking.benchmark.name}</div>
                          <div className="text-[#444444]">{paper.models[0]?.model.name ?? "—"}</div>
                          <div className="uppercase text-[#666666]">Rank</div>
                          <div className="font-semibold text-[#111111]">#{ranking.rank}</div>
                          <div className="text-right text-[12px] font-medium text-[#4A7AA0]">Compare →</div>
                        </div>
                      ))}
                    </div>
                  </Section>
                ) : null}

                {(paper.rankings.length > 0 || paper.sotaClaims.length > 0) ? (
                  <Section title="Rankings & Results">
                    <div className="space-y-3">
                      {paper.sotaClaims.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          {paper.sotaClaims.map((claim) => (
                            <div key={claim.id} className="rounded-lg border border-[#F1D8C8] bg-[#FFF7F1] px-4 py-4">
                              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F55036] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                                <Trophy size={12} />
                                SOTA
                              </div>
                              <div className="text-[14px] leading-7 text-[#352E27]">
                                State of the art on <span className="font-semibold text-[#201A16]">{claim.benchmark.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Section>
                ) : null}

                {!hasPrimaryContent ? (
                  <Section title="Overview">
                    <div className="rounded-lg border border-[#EDE5DA] bg-[#FCFAF7] p-5 text-[14px] leading-8 text-[#4A433B]">
                      This paper has limited structured metadata available from the current API response.
                      You can still use the links, citation tools, and related paper references on this page when they are available.
                    </div>
                  </Section>
                ) : null}

                {!relatedLoading && relatedPapers.length > 0 ? (
                  <Section title="Related Papers" meta={<span>{relatedPapers.length} papers</span>}>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {relatedPapers.map((relatedPaper) => (
                        <RelatedPaperCard key={relatedPaper.slug || relatedPaper.id} paper={relatedPaper} />
                      ))}
                    </div>
                  </Section>
                ) : null}
              </div>
            </Card>

            <div className="no-print mt-5 border-t border-[#E5E5E0] pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#555555] no-underline hover:text-[#F55036]"
              >
                <ArrowLeft size={14} />
                Back to papers
              </Link>
            </div>
          </main>

          <aside className="no-print self-start space-y-4 xl:sticky xl:top-3">
            {hasGitHub ? (
              <SidebarSection title="Repository">
                <div className="space-y-3">
                  {paper.githubUrl ? (
                    <div className="rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] p-3">
                      <div className="flex items-center gap-2 text-[13px] font-medium text-[#111111]">
                        <Github size={15} className="text-[#111111]" />
                        <span>GitHub</span>
                      </div>
                      {hasGitHubStats ? (
                        <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-[#6B6258]">
                          {paper.githubStars != null && paper.githubStars > 0 ? (
                            <span className="inline-flex items-center gap-1"><Star size={11} className="text-[#F55036]" /> {formatCompactNumber(paper.githubStars)} stars</span>
                          ) : null}
                          {paper.githubForks != null && paper.githubForks > 0 ? (
                            <span className="inline-flex items-center gap-1"><GitBranch size={11} className="text-[#F55036]" /> {formatCompactNumber(paper.githubForks)} forks</span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {paper.githubUrl ? (
                    <a
                      href={paper.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6E665D] no-underline hover:text-[#F55036]"
                    >
                      Open in GitHub
                      <ExternalLink size={12} />
                    </a>
                  ) : null}

                  {paper.isOfficialCode != null ? (
                    <div className="text-[12px] text-[#6F665D]">
                      {paper.isOfficialCode ? "Official implementation" : "Code repository available"}
                    </div>
                  ) : null}
                </div>
              </SidebarSection>
            ) : null}

            {showHuggingFace ? (
              <SidebarSection title="Hugging Face">
                <div className="rounded-xl border border-[#F0E8D4] bg-[#FFF9EC] p-3">
                  <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[#3A3128]">
                    <span>🤗</span>
                    <span>Community traction</span>
                  </div>
                  <div className="text-[13px] text-[#3A3128]">
                    <span className="font-semibold">{formatCompactNumber(paper.hfUpvotes ?? 0)}</span> upvotes
                  </div>
                </div>
              </SidebarSection>
            ) : null}

            <SidebarSection title="Citation">
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCopyCitation("apa")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white px-3 py-1.5 text-[11px] font-medium text-[#555555] hover:bg-[#FFF7F3]"
                  >
                    <Copy size={12} className="text-[#F55036]" />
                    Copy
                  </button>
                </div>

                <div className="rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] p-4">
                  <pre className="whitespace-pre-wrap break-words text-[12px] leading-7 text-[#484037]">
                    {generateCitation(paper, "apa")}
                  </pre>
                </div>

                <div className="grid gap-2">
                  {citationFormats.map((fmt) => {
                    const isCopied = citationCopied === fmt.key;
                    return (
                      <button
                        key={fmt.key}
                        onClick={() => handleCopyCitation(fmt.key)}
                        className="flex w-full items-center justify-between rounded-md border border-[#E5E5E0] bg-white px-4 py-2.5 text-[12px] font-medium text-[#111111] hover:bg-[#F8F7F2]"
                      >
                        <span>{fmt.label}</span>
                        {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-[#F55036]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </SidebarSection>

            {hasPaperDetails ? (
              <SidebarSection title="Paper Details">
                <div>
                  {paper.publicationDate ? <DetailRow label="Published" value={formatDate(paper.publicationDate)} /> : null}
                  {paper.createdAt ? <DetailRow label="Added" value={formatDateTime(paper.createdAt)} /> : null}
                  {paper.updatedAt ? <DetailRow label="Updated" value={formatDateTime(paper.updatedAt)} /> : null}
                  {paper.arxivId ? (
                    <DetailRow
                      label="arXiv"
                      value={
                        <a href={arxivUrl ?? undefined} target="_blank" rel="noopener noreferrer" className="text-[#F55036] hover:underline">
                          {paper.arxivId}
                        </a>
                      }
                    />
                  ) : null}
                  {paper.trendingScore != null && paper.trendingScore > 0 ? (
                    <DetailRow label="Score" value={paper.trendingScore.toFixed(1)} />
                  ) : null}
                  {paper.submissionDate && paper.submissionDate !== paper.publicationDate ? (
                    <DetailRow label="Submitted" value={formatDate(paper.submissionDate)} />
                  ) : null}
                  {paper.paperType ? <DetailRow label="Type" value={paper.paperType} /> : null}
                  {paper.status ? <DetailRow label="Status" value={paper.status} /> : null}
                  {paper.language ? <DetailRow label="Language" value={paper.language} /> : null}
                  {paper.license ? <DetailRow label="License" value={paper.license} /> : null}
                  {paper.pageCount != null ? <DetailRow label="Pages" value={paper.pageCount} /> : null}
                  {paper.referenceCount > 0 ? <DetailRow label="References" value={formatCompactNumber(paper.referenceCount)} /> : null}
                  {paper.discoverySource ? <DetailRow label="Source" value={paper.discoverySource} /> : null}
                  {paper.slug ? <DetailRow label="Slug" value={paper.slug} /> : null}
                </div>
              </SidebarSection>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
