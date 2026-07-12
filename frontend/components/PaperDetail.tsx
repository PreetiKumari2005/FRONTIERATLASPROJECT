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
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  Quote,
  Star,
  GitBranch,
  Heart,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useEffect, type ReactNode } from "react";
import type { PaperDetail as PaperDetailType, PaperRanking, PaperSotaClaim } from "@/lib/papers";
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

type CitationFormat = "bibtex" | "apa" | "mla" | "chicago";

const CITATION_FORMATS: { key: CitationFormat; label: string }[] = [
  { key: "bibtex", label: "BibTeX" },
  { key: "apa", label: "APA" },
  { key: "mla", label: "MLA" },
  { key: "chicago", label: "Chicago" },
];

function parseGitHubRepo(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.replace("www.", "") !== "github.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  } catch {
    // ignore
  }
  return null;
}

function generateCitation(paper: PaperDetailType, format: CitationFormat): string {
  const year = getCitationYear(paper.publicationDate);
  const authors = paper.authors.map((pa) => pa.author.name);
  const authorStr = authors.length > 0 ? authors.join(", ") : "Unknown Author";
  const title = paper.title;
  const doi = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const arxiv = paper.arxivId ? `arXiv:${paper.arxivId}` : null;
  const source = arxiv || "Online";
  const lastName = authors[0]?.split(/\s+/).pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "unknown";
  const citeKey = `${lastName}${year}`;

  switch (format) {
    case "bibtex": {
      const lines = [
        `@article{${citeKey},`,
        `  author = {${authorStr}},`,
        `  title = {${title}},`,
        `  year = {${year}},`,
      ];
      if (paper.arxivId) lines.push(`  eprint = {${paper.arxivId}},`, `  archivePrefix = {arXiv},`);
      if (paper.doi) lines.push(`  doi = {${paper.doi}},`);
      lines.push(`}`);
      return lines.join("\n");
    }
    case "apa":
      return `${authorStr} (${year}). ${title}. ${source}.${doi ? ` https://doi.org/${paper.doi}` : ""}`;
    case "mla":
      return `${authorStr}. "${title}." ${source}, ${year}.${doi ? ` doi:${paper.doi}.` : ""}`;
    case "chicago":
      return `${authorStr}. ${year}. "${title}." ${source}.${doi ? ` https://doi.org/${paper.doi}.` : ""}`;
  }
}

function CitationPreview({ text, format }: { text: string; format: CitationFormat }) {
  if (format !== "bibtex") {
    return (
      <pre className="whitespace-pre-wrap break-words font-mono text-[11.5px] leading-[1.75] text-[#484037]">
        {text}
      </pre>
    );
  }

  const lines = text.split("\n");
  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[11.5px] leading-[1.75]">
      {lines.map((line, index) => {
        const entryMatch = line.match(/^(@\w+\{)([^,]+)(,)?$/);
        const fieldMatch = line.match(/^(\s+)(\w+)(\s*=\s*)(\{.*\}),?$/);

        if (entryMatch) {
          return (
            <span key={index}>
              <span className="text-[#6B21A8]">{entryMatch[1]}</span>
              <span className="text-[#B45309]">{entryMatch[2]}</span>
              <span className="text-[#6B21A8]">{entryMatch[3] ?? ""}</span>
              {"\n"}
            </span>
          );
        }

        if (fieldMatch) {
          return (
            <span key={index}>
              {fieldMatch[1]}
              <span className="text-[#0369A1]">{fieldMatch[2]}</span>
              {fieldMatch[3]}
              <span className="text-[#047857]">{fieldMatch[4]}</span>
              {line.endsWith(",") ? "," : ""}
              {"\n"}
            </span>
          );
        }

        return (
          <span key={index} className="text-[#484037]">
            {line}
            {"\n"}
          </span>
        );
      })}
    </pre>
  );
}

function RepositoryPanel({ paper }: { paper: PaperDetailType }) {
  const repoName = parseGitHubRepo(paper.githubUrl);
  const hasStars = paper.githubStars != null && paper.githubStars > 0;
  const hasForks = paper.githubForks != null && paper.githubForks > 0;
  const hasHfUpvotes = paper.hfUpvotes != null && paper.hfUpvotes > 0;

  if (!paper.githubUrl && !hasHfUpvotes) {
    return (
      <div>
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E5E0]">
          <Github size={14} className="text-[#8B8B8B]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555555] m-0">Repository</h3>
        </div>
        <div className="pt-4 pb-2 flex flex-col items-center text-center">
          <Github size={22} className="mb-2.5 text-[#DCDCD7]" strokeWidth={1.5} />
          <p className="text-[13px] font-semibold text-[#555555]">No repository available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E5E0]">
        <Github size={14} className="text-[#8B8B8B]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555555] m-0">Repository</h3>
      </div>
      <div className="pt-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex flex-col gap-1.5">
            <p className="font-mono text-[13px] font-bold text-[#171717] m-0 truncate">
              {repoName ?? "GitHub Repository"}
            </p>
            <div className="flex items-center gap-2">
              {paper.isOfficialCode === true && (
                <span className="inline-flex items-center rounded-full border border-[#BAE6FD] bg-[#E0F2FE] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#0369A1]">
                  Official
                </span>
              )}
              {hasStars && (
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#444444]">
                  <Star size={12} fill="#FF5A1F" stroke="#FF5A1F" />
                  {formatCompactNumber(paper.githubStars!)}
                </span>
              )}
              {hasForks && (
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#444444]">
                  <GitBranch size={12} className="text-[#FF5A1F]" />
                  {formatCompactNumber(paper.githubForks!)}
                </span>
              )}
            </div>
          </div>
          <Github size={18} className="shrink-0 text-[#8B8B8B]" />
        </div>

        {paper.hfUpvotes != null && (
          <div className="flex items-center gap-2.5 py-2.5 border-t border-b border-[#EDE8DF]">
            <Heart size={15} className="text-[#FF5A1F]" />
            <span className="text-[12.5px] font-semibold text-[#444444]">
              {formatCompactNumber(paper.hfUpvotes)}
              <span className="font-medium text-[#8B8B8B] ml-1">Hugging Face upvotes</span>
            </span>
          </div>
        )}

        {paper.githubUrl && (
          <>
            <p className="text-[11.5px] font-medium text-[#6F665D] m-0">
              {paper.isOfficialCode ? "Official implementation from the authors" : "Community-maintained repository"}
            </p>
            <a
              href={paper.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#E0DDD6] bg-transparent px-4 py-2.5 text-[13px] font-medium text-[#444444] no-underline transition-all hover:bg-[rgba(255,90,31,0.06)] hover:text-[#FF5A1F] hover:border-[rgba(255,90,31,0.3)]"
            >
              Open Repository
              <ExternalLink size={13} />
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function CitationPanel({
  paper,
  selectedFormat,
  onFormatChange,
  onCopy,
  copiedFormat,
}: {
  paper: PaperDetailType;
  selectedFormat: CitationFormat;
  onFormatChange: (format: CitationFormat) => void;
  onCopy: (format: CitationFormat) => void;
  copiedFormat: CitationFormat | null;
}) {
  const citationText = generateCitation(paper, selectedFormat);
  const isCopied = copiedFormat === selectedFormat;

  return (
    <div>
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E5E0]">
        <Quote size={14} className="text-[#8B8B8B]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555555] m-0">Citation</h3>
      </div>
      <div className="pt-4 flex flex-col gap-3.5">
        <div className="flex rounded-lg border border-[#E0DDD6] bg-[#F6F5F0] p-[3px]">
          {CITATION_FORMATS.map((fmt) => {
            const active = selectedFormat === fmt.key;
            return (
              <button
                key={fmt.key}
                type="button"
                onClick={() => onFormatChange(fmt.key)}
                className={`flex-1 rounded-[5px] px-1.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.06em] transition-all ${
                  active
                    ? "bg-white text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    : "bg-transparent text-[#8B8B8B] hover:text-[#555555]"
                }`}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-xl border border-[#EDE8DF] p-3.5">
          <CitationPreview text={citationText} format={selectedFormat} />
        </div>

        <button
          type="button"
          onClick={() => onCopy(selectedFormat)}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium transition-all ${
            isCopied
              ? "scale-[0.98] border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]"
              : "border-[#E0DDD6] bg-transparent text-[#444444] hover:bg-[rgba(255,90,31,0.06)] hover:text-[#FF5A1F] hover:border-[rgba(255,90,31,0.3)]"
          }`}
        >
          {isCopied ? (
            <>
              <Check size={14} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy citation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PaperMetadataPanel({
  paper,
  arxivUrl,
  doiUrl,
}: {
  paper: PaperDetailType;
  arxivUrl: string | null;
  doiUrl: string | null;
}) {
  const categoryLabels = paper.tasks.map((t) => t.task.name);
  const conferenceLabels = paper.conferences.map((c) => c.conference.name);

  const rows: { label: string; value: ReactNode }[] = [];

  if (paper.publicationDate) rows.push({ label: "Published", value: formatDate(paper.publicationDate) });
  if (paper.updatedAt) rows.push({ label: "Updated", value: formatDateTime(paper.updatedAt) });
  if (paper.doi) {
    rows.push({
      label: "DOI",
      value: doiUrl ? (
        <a href={doiUrl} target="_blank" rel="noopener noreferrer" className="text-[#4A7AA0] no-underline hover:underline text-[13px] font-medium">
          {paper.doi}
        </a>
      ) : (
        <span className="text-[13px] font-medium text-[#171717]">{paper.doi}</span>
      ),
    });
  }
  if (paper.arxivId) {
    rows.push({
      label: "arXiv",
      value: arxivUrl ? (
        <a href={arxivUrl} target="_blank" rel="noopener noreferrer" className="text-[#4A7AA0] no-underline hover:underline text-[13px] font-medium">
          {paper.arxivId}
        </a>
      ) : (
        <span className="text-[13px] font-medium text-[#171717]">{paper.arxivId}</span>
      ),
    });
  }
  if (paper.license) rows.push({ label: "License", value: <span className="text-[13px] font-medium text-[#171717]">{paper.license}</span> });
  if (paper.discoverySource) rows.push({ label: "Source", value: <span className="text-[13px] font-medium text-[#171717]">{paper.discoverySource}</span> });
  if (paper.referenceCount > 0) rows.push({ label: "References", value: <span className="text-[13px] font-medium text-[#171717]">{formatCompactNumber(paper.referenceCount)}</span> });
  if (paper.citationCount > 0) rows.push({ label: "Citations", value: <span className="text-[13px] font-medium text-[#171717]">{formatCompactNumber(paper.citationCount)}</span> });
  if (paper.hfUpvotes != null && paper.hfUpvotes > 0) rows.push({ label: "HF Upvotes", value: <span className="text-[13px] font-medium text-[#171717]">{formatCompactNumber(paper.hfUpvotes)}</span> });
  if (categoryLabels.length > 0) rows.push({ label: "Categories", value: <span className="text-[13px] font-medium text-[#171717]">{categoryLabels.join(", ")}</span> });
  if (conferenceLabels.length > 0) rows.push({ label: "Venue", value: <span className="text-[13px] font-medium text-[#171717]">{conferenceLabels.join(", ")}</span> });
  if (paper.submissionDate && paper.submissionDate !== paper.publicationDate) {
    rows.push({ label: "Submitted", value: formatDate(paper.submissionDate) });
  }
  if (paper.paperType) rows.push({ label: "Type", value: <span className="text-[13px] font-medium text-[#171717]">{paper.paperType}</span> });
  if (paper.status) rows.push({ label: "Status", value: <span className="text-[13px] font-medium text-[#171717]">{paper.status}</span> });
  if (paper.language) rows.push({ label: "Language", value: <span className="text-[13px] font-medium text-[#171717]">{paper.language}</span> });
  if (paper.pageCount != null) rows.push({ label: "Pages", value: <span className="text-[13px] font-medium text-[#171717]">{paper.pageCount}</span> });

  if (rows.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E5E0]">
        <BookOpen size={14} className="text-[#8B8B8B]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555555] m-0">Paper Details</h3>
      </div>
      <div className="pt-1">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-start justify-between gap-4 py-3 ${i < rows.length - 1 ? "border-b border-[#F2EEE6]" : ""}`}
          >
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B8B]">{row.label}</span>
            <div className="text-right break-words max-w-[60%]">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,90,31,0.1)] px-3 py-1 text-[12px] font-bold text-[#FF5A1F]">
      <Sparkles size={13} fill="#FF5A1F" stroke="none" />
      Trending
    </span>
  );
}

function RankDisplay({ rank }: { rank: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="tabular-nums tracking-tight font-black text-[#171717]">#{rank}</span>
    </div>
  );
}

function BenchmarksSection({
  rankings,
  models,
  sotaClaims,
}: {
  rankings: PaperRanking[];
  models: PaperDetailType["models"];
  sotaClaims: PaperSotaClaim[];
}) {
  const sotaBenchmarkIds = new Set(sotaClaims.map((claim) => claim.benchmark_id));
  const sortedRankings = [...rankings].sort((a, b) => a.rank - b.rank);
  const modelName = models[0]?.model.name ?? null;
  const showRankDelta = sortedRankings.some((ranking) => ranking.previous_rank != null);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="section-label">BENCHMARKS</h2>

      {sortedRankings.length > 0 || sotaClaims.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E5E5E0]">
                  <th className="w-[88px] px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">Rank</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">Benchmark</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">Model</th>
                  {showRankDelta && <th className="w-[88px] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">Change</th>}
                  <th className="w-[108px] px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">Compare</th>
                </tr>
              </thead>
              <tbody>
                {sortedRankings.map((ranking) => {
                  const isSota = sotaBenchmarkIds.has(ranking.benchmark_id);
                  return (
                    <tr key={ranking.id} className="border-b border-[#F2EEE6] transition-colors hover:bg-[rgba(255,90,31,0.02)]">
                      <td className="px-5 py-4">
                        <RankDisplay rank={ranking.rank} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-semibold text-[#171717]">{ranking.benchmark.name}</span>
                          {isSota && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#F0DECF] bg-[#FFF9F4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#B48C52]">
                              SOTA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[13px] font-medium text-[#555555]">{modelName ?? "—"}</span>
                      </td>
                      {showRankDelta && (
                        <td className="px-4 py-4">
                          {ranking.previous_rank != null && ranking.previous_rank !== ranking.rank && (
                            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${ranking.rank < ranking.previous_rank ? "bg-[#ECFDF5] text-[#047857]" : "bg-[#FEF2F2] text-[#B91C1C]"}`}>
                              {ranking.rank < ranking.previous_rank ? "↑" : "↓"}{Math.abs(ranking.previous_rank - ranking.rank)}
                            </span>
                          )}
                        </td>
                      )}
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4A7AA0] opacity-60 transition-opacity hover:opacity-100 cursor-pointer">
                          Compare →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {sortedRankings.map((ranking) => {
              const isSota = sotaBenchmarkIds.has(ranking.benchmark_id);
              const improved = ranking.previous_rank != null && ranking.rank < ranking.previous_rank;
              const worsened = ranking.previous_rank != null && ranking.rank > ranking.previous_rank;
              return (
                <div key={ranking.id} className="py-3 border-b border-[#EDE8DF]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[18px] font-black text-[#FF5A1F]">#{ranking.rank}</span>
                    </div>
                    {isSota && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#F0DECF] bg-[#FFF9F4] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#B48C52]">
                        SOTA
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-semibold text-[#171717] m-0 mb-1">{ranking.benchmark.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-[#8B8B8B]">{modelName ?? "—"}</span>
                    {improved && (
                      <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold bg-[#ECFDF5] text-[#047857]">
                        ↑{Math.abs(ranking.previous_rank! - ranking.rank)}
                      </span>
                    )}
                    {worsened && (
                      <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold bg-[#FEF2F2] text-[#B91C1C]">
                        ↓{Math.abs(ranking.previous_rank! - ranking.rank)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : sotaClaims.length > 0 ? (
        <div className="space-y-3">
          {sotaClaims.map((claim) => (
            <div key={claim.id} className="flex items-center gap-3 rounded-xl border border-[#F0DECF] bg-[#FFF9F4] px-4 py-3.5">
              <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase">SOTA</span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#171717]">{claim.benchmark.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-[11px] text-[#999] italic">Not available</span>
      )}
    </div>
  );
}

function RelatedPaperCard({ paper }: { paper: Paper }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = !!paper.thumbnail && !thumbnailFailed;

  const displayAuthors = (() => {
    if (!paper.authors) return "";
    const list = paper.authors.split(",").map((a) => a.trim());
    if (list.length > 2) return `${list[0]}, ${list[1]} et al.`;
    return paper.authors;
  })();

  const hasCode = !!paper.githubUrl;
  const hasConference = !!paper.conference && paper.conference !== "";

  return (
    <Link
      href={`/papers/${paper.slug || paper.id}`}
      className="related-paper flex rounded-lg no-underline overflow-hidden transition-all hover:bg-[rgba(255,90,31,0.04)]"
    >
      <div className="w-[160px] shrink-0 bg-[#EFECE6] rounded-l-lg overflow-hidden flex items-center justify-center relative">
        {showThumbnail ? (
          <Image
            src={paper.thumbnail}
            alt={`Preview of ${paper.title}`}
            width={160}
            height={120}
            unoptimized
            className="w-full h-full object-cover"
            onError={() => setThumbnailFailed(true)}
          />
        ) : (
          <div className="w-full p-3.5 flex flex-col gap-1.5">
            <div className="h-[3px] rounded bg-black/5 w-1/2" />
            <div className="h-[5px] rounded bg-black/6 w-[90%]" />
            <div className="h-[5px] rounded bg-black/6 w-[70%]" />
            <div className="h-[3px] rounded bg-black/4 w-[55%] mt-1" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 p-2.5 pl-2.5 flex flex-col">
        <h4 className="text-[13px] font-semibold leading-[1.35] text-[#171717] m-0 mb-1 line-clamp-2 transition-colors group-hover:text-[#FF5A1F]">
          {paper.title}
        </h4>
        <p className="text-[10.5px] text-[#8B8B8B] m-0 mb-1.5 truncate leading-snug">
          {displayAuthors || "Unknown"}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap mt-auto">
          {hasConference && (
            <span className="px-1 py-[1px] rounded-[3px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[8.5px] font-bold uppercase leading-tight">
              {paper.conference}
            </span>
          )}
          {hasCode && (
            <span className="inline-flex items-center gap-1 px-1 py-[1px] rounded-[3px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[8.5px] font-bold leading-tight">
              Code
            </span>
          )}
          <span className="text-[9px] text-[#9CA3AF]">{paper.date || ""}</span>
          {paper.citations > 0 && (
            <span className="ml-auto inline-flex items-center gap-0.5 text-[9px] text-[#9CA3AF] whitespace-nowrap">
              <Quote size={8} className="text-[#C0BDB8]" />
              {formatCompactNumber(paper.citations)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function PaperDetail({ paper }: { paper: PaperDetailType }) {
  const [citationCopied, setCitationCopied] = useState<CitationFormat | null>(null);
  const [selectedCitationFormat, setSelectedCitationFormat] = useState<CitationFormat>("bibtex");
  const [abstractExpanded, setAbstractExpanded] = useState(false);
  const [relatedPapers, setRelatedPapers] = useState<Paper[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const arxivUrl = paper.arxivId ? `https://arxiv.org/abs/${paper.arxivId}` : null;
  const doiUrl = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const previewHref =
    paper.pdfUrl || paper.paperUrl || arxivUrl || doiUrl || paper.sourceUrl || paper.projectUrl;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: paper.title, url: window.location.href });
      } catch {
        // user dismissed or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // ignore
    }
  }, [paper.title]);

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

  return (
    <div className={`${atlasUiFont.className} min-h-screen bg-[#F8F7F2] text-[#171717] tracking-tight selection:bg-[rgba(255,90,31,0.16)]`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12pt; color: #000; background: #fff; }
          a { color: #000 !important; text-decoration: underline !important; }
        }
        .section-label {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #8B8B8B;
          margin: 0;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E5E5E0;
        }
        .section-label-muted {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.11em;
          color: #B0ABA3;
          margin: 0;
        }
        .section-label-muted::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E5E5E0;
        }
        .related-paper { transition: all 0.2s ease; }
        .related-paper:hover .rp-thumb { background: #E4E0D8; }
        .hover-dim { transition: opacity 0.2s ease; }
        .hover-dim:hover { opacity: 0.7; }
        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: rgba(255,90,31,0.02); }
        .related-paper h4 { transition: color 0.2s ease; }
        .related-paper:hover h4 { color: #FF5A1F !important; }
      `}</style>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 md:px-12 lg:px-16 lg:py-6">

        {/* Breadcrumb */}
        <nav className="mb-5 lg:mb-6 flex items-center gap-2 text-[12.5px] font-semibold text-[#8B8B8B]" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-[#FF5A1F] no-underline text-[#8B8B8B]">Trending</Link>
          <span className="text-[#DCDCD7] font-normal" aria-hidden="true">/</span>
          <span className="text-[#555555] truncate max-w-[200px] sm:max-w-none">
            {paper.arxivId ? `arXiv:${paper.arxivId}` : "Research"}
          </span>
        </nav>

        {/* Grid: Main + Sidebar */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px] xl:gap-10">

          {/* ===== MAIN CONTENT ===== */}
          <main className="space-y-8 lg:space-y-10 min-w-0">

            {/* HEADER */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-4">

                {/* Badge row */}
                <div className="flex flex-wrap items-center gap-3">
                  {paper.trendingScore && paper.trendingScore > 0 ? <TrendingBadge /> : null}
                  {paper.arxivId && (
                    <span className="inline-flex items-center rounded-full border border-[#E0DDD6] bg-[#F6F5F0] px-3 py-1 text-[11px] font-bold tracking-wider text-[#555555]">
                      arXiv:{paper.arxivId}
                    </span>
                  )}
                  {paper.conferences.slice(0, 2).map((c) => (
                    <span key={c.conference_id} className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[11px] font-bold uppercase tracking-wide">
                      {c.conference.name}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-[26px] font-black leading-[1.1] tracking-[-0.03em] text-[#171717] md:text-[34px] lg:text-[38px]">
                  {paper.title}
                </h1>

                {/* Authors */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  {paper.authors.slice(0, 8).map((pa, i) => (
                    <span key={pa.author.id} className="inline-flex items-center">
                      {i > 0 && <span className="mr-2 text-[#DCDCD7]">·</span>}
                      <Link href={`/authors/${pa.author.slug}`} className="text-[14px] font-semibold text-[#444444] no-underline hover:text-[#FF5A1F] hover:underline decoration-2 underline-offset-4 transition-colors">
                        {pa.author.name}
                      </Link>
                    </span>
                  ))}
                  {paper.authors.length > 8 && (
                    <span className="ml-1 text-[13px] font-bold text-[#FF5A1F]">+{paper.authors.length - 8} more</span>
                  )}
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1">
                  {paper.citationCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[13.5px] font-bold text-[#171717]">{formatCompactNumber(paper.citationCount)}</span>
                      <span className="text-[9.5px] font-medium text-[#999999]">citations</span>
                    </div>
                  )}
                  {paper.githubStars != null && paper.githubStars > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star size={13} fill="#FF5A1F" stroke="#FF5A1F" strokeWidth={1} />
                      <span className="text-[13.5px] font-bold text-[#171717]">{formatCompactNumber(paper.githubStars)}</span>
                      <span className="text-[9.5px] font-medium text-[#999999]">stars</span>
                    </div>
                  )}
                  {paper.githubForks != null && paper.githubForks > 0 && (
                    <div className="flex items-center gap-1.5">
                      <GitBranch size={13} className="text-[#FF5A1F]" strokeWidth={1.8} />
                      <span className="text-[13.5px] font-bold text-[#171717]">{formatCompactNumber(paper.githubForks)}</span>
                      <span className="text-[9.5px] font-medium text-[#999999]">forks</span>
                    </div>
                  )}
                  {paper.hfUpvotes != null && paper.hfUpvotes > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Heart size={13} className="text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[13.5px] font-bold text-[#171717]">{formatCompactNumber(paper.hfUpvotes)}</span>
                      <span className="text-[9.5px] font-medium text-[#999999]">HF upvotes</span>
                    </div>
                  )}
                  {paper.referenceCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={13} className="text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[13.5px] font-bold text-[#171717]">{formatCompactNumber(paper.referenceCount)}</span>
                      <span className="text-[9.5px] font-medium text-[#999999]">references</span>
                    </div>
                  )}
                  {paper.publicationDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[13.5px] font-bold text-[#171717]">{formatDate(paper.publicationDate)}</span>
                      <span className="text-[9.5px] font-medium text-[#999999]">published</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={paper.pdfUrl || arxivUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-button inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-2.5 text-[14px] font-semibold text-white no-underline transition-all hover:bg-[#FF6C37] active:scale-[0.97]"
                  >
                    <FileText size={18} />
                    View PDF
                  </a>
                  {arxivUrl && (
                    <a
                      href={arxivUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ds-button-ghost inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#E0DDD6] bg-transparent px-5 py-2 text-[13px] font-medium text-[#444444] no-underline transition-all hover:bg-[rgba(255,90,31,0.06)] hover:text-[#FF5A1F] hover:border-[rgba(255,90,31,0.3)] active:scale-[0.97]"
                    >
                      <Globe size={18} />
                      arXiv
                    </a>
                  )}
                  {paper.githubUrl && (
                    <a
                      href={paper.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ds-button-ghost inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#E0DDD6] bg-transparent px-5 py-2 text-[13px] font-medium text-[#444444] no-underline transition-all hover:bg-[rgba(255,90,31,0.06)] hover:text-[#FF5A1F] hover:border-[rgba(255,90,31,0.3)] active:scale-[0.97]"
                    >
                      <Github size={18} />
                      Code
                      {paper.githubStars != null && paper.githubStars > 0 && (
                        <span className="text-[#8B8B8B] font-bold">{formatCompactNumber(paper.githubStars)}</span>
                      )}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCitation("apa")}
                      className="ds-button-ghost !p-0 w-11 h-11 rounded-full border-[1.5px] border-[#E0DDD6] bg-transparent inline-flex items-center justify-center transition-all hover:bg-[rgba(255,90,31,0.06)] hover:text-[#FF5A1F] hover:border-[rgba(255,90,31,0.3)] active:scale-[0.97]"
                      title="Cite"
                    >
                      <Quote size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="ds-button-ghost !p-0 w-11 h-11 rounded-full border-[1.5px] border-[#E0DDD6] bg-transparent inline-flex items-center justify-center transition-all hover:bg-[rgba(255,90,31,0.06)] hover:text-[#FF5A1F] hover:border-[rgba(255,90,31,0.3)] active:scale-[0.97]"
                      title="Share"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      type="button"
                      className="ds-button-ghost !p-0 w-11 h-11 rounded-full border-[1.5px] border-[#E0DDD6] bg-transparent inline-flex items-center justify-center transition-all hover:bg-[rgba(255,90,31,0.06)] hover:text-[#FF5A1F] hover:border-[rgba(255,90,31,0.3)] active:scale-[0.97]"
                      title="Save"
                    >
                      <Star size={18} />
                    </button>
                  </div>
                </div>

                {/* Benchmark Highlights */}
                {paper.rankings && paper.rankings.length > 0 && (
                  <div className="flex flex-col gap-2 pt-3 border-l-[3px] border-[rgba(255,90,31,0.15)] pl-4">
                    {paper.rankings.slice(0, 3).map((ranking) => (
                      <div key={ranking.id} className="flex items-center gap-2 text-[13.5px] font-semibold text-[#171717]">
                        <span className="text-[#FF5A1F]">#{ranking.rank}</span>
                        <span className="text-[#8B8B8B] font-medium">on</span>
                        <span className="hover:text-[#FF5A1F] transition-colors cursor-pointer border-b border-transparent hover:border-[rgba(255,90,31,0.3)]">{ranking.benchmark.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview (desktop) */}
              <div className="hidden lg:block w-[200px] lg:w-[220px] shrink-0">
                <a
                  href={previewHref || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block overflow-hidden rounded-[18px] transition-all duration-300 group ${!previewHref ? 'pointer-events-none' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="relative"
                    style={{ aspectRatio: '3/4', background: '#EFECE6', transition: 'transform 0.4s ease' }}
                  >
                    {paper.thumbnailUrl ? (
                      <Image
                        src={paper.thumbnailUrl}
                        alt={`Preview of ${paper.title}`}
                        width={220}
                        height={293}
                        unoptimized
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="preview-page flex flex-col h-full p-5 pb-3.5">
                        <div className="h-[3px] rounded mb-3 bg-black/5 w-2/5" />
                        <div className="h-[6px] rounded mb-1.5 bg-black/7 w-[85%]" />
                        <div className="h-[6px] rounded mb-1.5 bg-black/7 w-[60%]" />
                        <div className="mt-2.5 space-y-1.5">
                          <div className="h-1 rounded bg-black/5 w-[92%]" />
                          <div className="h-1 rounded bg-black/5 w-[78%]" />
                          <div className="h-1 rounded bg-black/5 w-[92%]" />
                          <div className="h-1 rounded bg-black/5 w-[60%]" />
                        </div>
                        <div className="mt-auto pt-2.5 flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-black/5" />
                          <div className="h-1 w-[60px] rounded bg-black/5" />
                        </div>
                      </div>
                    )}
                  </div>
                </a>
              </div>
            </div>

            {/* AI Summary (TL;DR) */}
            {paper.tlDr && (
              <div style={{ borderLeft: '3px solid rgba(255,90,31,0.15)', paddingLeft: '20px' }}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-[7px] bg-[#FF5A1F] text-white">
                    <Sparkles size={13} fill="currentColor" stroke="none" />
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-[0.15em] text-[#171717]">TL;DR</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#F0EFE9] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B8B8B]" />
                    AI
                  </span>
                </div>
                <p className="text-[15px] font-medium leading-[1.8] text-[#333333] m-0">
                  {paper.tlDr}
                </p>
              </div>
            )}

            {/* ===== MAIN CONTENT SECTIONS ===== */}
            <div className="flex flex-col gap-8">

              {/* ABSTRACT */}
              {paper.abstract && (
                <div className="flex flex-col gap-3">
                  <h2 className="section-label-muted">ABSTRACT</h2>
                  <div className="relative">
                    <p
                      className={`text-[14.5px] leading-[1.8] text-[#484848] font-[450] m-0 ${
                        abstractExpanded ? "" : "max-h-[130px] overflow-hidden"
                      }`}
                      style={{ transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {paper.abstract}
                    </p>
                    {!abstractExpanded && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '48px',
                        background: 'linear-gradient(to top, #F8F7F2, transparent)',
                        pointerEvents: 'none',
                        transition: 'opacity 0.3s ease',
                      }} />
                    )}
                  </div>
                  <button
                    onClick={() => setAbstractExpanded((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#FF5A1F] hover:text-[#FF6C37] transition-colors focus-visible:outline-none bg-transparent border-none cursor-pointer p-0 w-fit"
                    aria-expanded={abstractExpanded}
                  >
                    <span id="abstract-btn-text">{abstractExpanded ? "Show less" : "Read full abstract"}</span>
                    <ChevronDown size={15} className={`transition-transform ${abstractExpanded ? "rotate-180" : ""}`} />
                  </button>
                </div>
              )}

              {/* RESEARCH TAXONOMY */}
              <h2 className="section-label">RESEARCH TAXONOMY</h2>

              {/* TASKS */}
              <section className="flex flex-col gap-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8B8B8B] m-0">TASKS</h3>
                {paper.tasks.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {paper.tasks.map((t) => (
                      <Link
                        key={t.task.id}
                        href={`/tasks/${t.task.slug}`}
                        className="inline-flex items-center gap-1 rounded-[4px] border border-[#D4EDDA] bg-[#F1F9F2] px-2 py-0.5 text-[11.5px] font-medium text-[#2D6A4F] no-underline hover:opacity-80 transition-opacity"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#2D6A4F] opacity-50" />
                        {t.task.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-[#999] italic">Not available</span>
                )}
              </section>

              {/* METHODS */}
              <section className="flex flex-col gap-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8B8B8B] m-0">METHODS</h3>
                {paper.methods.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {paper.methods.map((m) => (
                      <Link
                        key={m.method.id}
                        href={`/methods/${m.method.slug}`}
                        className="inline-flex items-center gap-1 rounded-[4px] border border-[#E2D5F0] bg-[#F5F0FA] px-2 py-0.5 text-[11.5px] font-medium text-[#5B3A8C] no-underline hover:opacity-80 transition-opacity"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#5B3A8C] opacity-50" />
                        {m.method.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-[#999] italic">Not available</span>
                )}
              </section>

              {/* MODELS */}
              <section className="flex flex-col gap-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8B8B8B] m-0">MODELS</h3>
                {paper.models.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {paper.models.map((m) => (
                      <Link
                        key={m.model.id}
                        href={`/models/${m.model.slug}`}
                        className="inline-flex items-center gap-1 rounded-[4px] border border-[#FDE4C8] bg-[#FFF8F0] px-2 py-0.5 text-[11.5px] font-medium text-[#A45C00] no-underline hover:opacity-80 transition-opacity"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#A45C00] opacity-50" />
                        {m.model.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-[#999] italic">Not available</span>
                )}
              </section>

              {/* DATASETS */}
              <section className="flex flex-col gap-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8B8B8B] m-0">DATASETS</h3>
                {paper.datasets.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {paper.datasets.map((d) => (
                      <Link
                        key={d.dataset.id}
                        href={`/datasets/${d.dataset.slug}`}
                        className="inline-flex items-center gap-1 rounded-[4px] border border-[#D0E6F2] bg-[#EDF5FA] px-2 py-0.5 text-[11.5px] font-medium text-[#2C617D] no-underline hover:opacity-80 transition-opacity"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#2C617D] opacity-50" />
                        {d.dataset.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-[#999] italic">Not available</span>
                )}
              </section>

              {/* Benchmarks */}
              <BenchmarksSection
                rankings={paper.rankings}
                models={paper.models}
                sotaClaims={paper.sotaClaims}
              />

              {/* RELATED PAPERS */}
              <section className="border-t border-[#ECE7DD] pt-6">
                <h2 className="section-label mb-3.5">RELATED PAPERS</h2>
                {relatedLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex rounded-lg overflow-hidden animate-pulse">
                        <div className="w-[160px] h-[88px] bg-[#EFECE6] shrink-0" />
                        <div className="flex-1 p-2.5 space-y-1.5 bg-white">
                          <div className="h-3 bg-gray-100 rounded w-full" />
                          <div className="h-3 bg-gray-100 rounded w-3/4" />
                          <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : relatedPapers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                    {relatedPapers.map((relatedPaper) => (
                      <RelatedPaperCard key={relatedPaper.slug || relatedPaper.id} paper={relatedPaper} />
                    ))}
                  </div>
                ) : !relatedLoading ? (
                  <span className="text-[11px] text-[#999] italic">Not available</span>
                ) : null}
              </section>
            </div>

            {/* Back link */}
            <a
              href="/"
              className="hover-dim inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#8B8B8B] no-underline border-t border-[#E5E5E0] pt-3.5 transition-colors hover:text-[#FF5A1F]"
            >
              <ArrowLeft size={13} />
              Back to papers
            </a>
          </main>

          {/* ===== SIDEBAR ===== */}
          <aside className="space-y-5 xl:sticky xl:top-6 self-start">
            <RepositoryPanel paper={paper} />
            <CitationPanel
              paper={paper}
              selectedFormat={selectedCitationFormat}
              onFormatChange={setSelectedCitationFormat}
              onCopy={handleCopyCitation}
              copiedFormat={citationCopied}
            />
            <PaperMetadataPanel paper={paper} arxivUrl={arxivUrl} doiUrl={doiUrl} />
          </aside>
        </div>
      </div>
    </div>
  );
}
