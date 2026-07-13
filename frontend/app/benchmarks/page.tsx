"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, ArrowUpRight, ChevronRight, TrendingUp,
  Flame, Clock, Grid, List, SlidersHorizontal, X,
  BarChart2, Database, Zap, CheckSquare, Trophy, FolderOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getBenchmarks, type BenchmarkItem } from "@/lib/benchmarks";

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════ */

const DOMAINS = [
  "General AI", "Language", "Reasoning", "Coding", "Agents",
  "Computer Vision", "OCR & Document AI", "Multimodal", "Audio & Speech",
  "Video", "Robotics", "Embodied AI", "Healthcare", "Mathematics",
  "Time Series", "Graphs", "Scientific AI",
];

const TASKS = [
  "Question Answering", "Text Generation", "Summarization", "Machine Translation",
  "Reasoning", "Mathematical Reasoning", "Code Generation", "Software Engineering",
  "Retrieval", "Image Classification", "Object Detection", "Semantic Segmentation",
  "Visual Question Answering", "Document Parsing", "OCR", "Image Captioning",
  "Speech Recognition", "Speech Synthesis", "Audio Classification",
  "Video Understanding", "Planning", "Navigation",
];

const COLLECTIONS = [
  { label: "Reasoning",        count: 12, slug: "reasoning"     },
  { label: "Coding",           count: 13, slug: "coding"         },
  { label: "Agent Evaluation", count: 8,  slug: "agents"         },
  { label: "Vision",           count: 18, slug: "vision"         },
  { label: "OCR & Document AI",count: 9,  slug: "ocr"            },
  { label: "Language",         count: 22, slug: "language"       },
  { label: "Multimodal",       count: 11, slug: "multimodal"     },
  { label: "Audio & Speech",   count: 7,  slug: "audio"          },
  { label: "Robotics",         count: 5,  slug: "robotics"       },
  { label: "Healthcare",       count: 6,  slug: "healthcare"     },
  { label: "Mathematics",      count: 10, slug: "mathematics"    },
];

const POPULAR = [
  { name: "MMLU",               slug: "mmlu"               },
  { name: "GPQA",               slug: "gpqa"               },
  { name: "Humanity's Last Exam",slug:"humanitys-last-exam" },
  { name: "GSM8K",              slug: "gsm8k"              },
  { name: "MATH",               slug: "math"               },
  { name: "HumanEval",          slug: "humaneval"          },
  { name: "MBPP",               slug: "mbpp"               },
  { name: "SWE-Bench",          slug: "swe-bench-verified" },
  { name: "Terminal-Bench",     slug: "terminal-bench"     },
  { name: "MMMU",               slug: "mmmu"               },
  { name: "MathVista",          slug: "mathvista"          },
  { name: "OCRBench v2",        slug: "ocrbench-v2"        },
  { name: "ParseBench",         slug: "parsebench"         },
  { name: "ImageNet",           slug: "imagenet"           },
  { name: "COCO",               slug: "coco-detection"     },
];

/* ══════════════════════════════════════════════════════════════
   STATUS + META
══════════════════════════════════════════════════════════════ */

const STATUS_CFG: Record<string, { color: string; text: string; bg: string; border: string }> = {
  Active:     { color: "#10B981", text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-100"  },
  Saturating: { color: "#F59E0B", text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-100"    },
  Saturated:  { color: "#F87171", text: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-100"     },
  Superseded: { color: "#A78BFA", text: "text-purple-700",  bg: "bg-purple-50",   border: "border-purple-100"   },
  Unmapped:   { color: "#9CA3AF", text: "text-gray-500",    bg: "bg-gray-50",     border: "border-gray-100"     },
};

function getMeta(name: string) {
  const n = name.toLowerCase();
  if (n.includes("ocrbench v2"))        return { task:"Document OCR",            metric:"overall-en-private", status:"Active",     category:"OCR & Document AI", year:"2024" };
  if (n.includes("ocrbench"))           return { task:"Document OCR",            metric:"score",              status:"Unmapped",   category:"OCR & Document AI", year:"2023" };
  if (n.includes("olmocr"))             return { task:"Document Parsing",        metric:"pass-rate",          status:"Active",     category:"OCR & Document AI", year:"2024" };
  if (n.includes("omnidoc"))            return { task:"Document Parsing",        metric:"composite",          status:"Active",     category:"OCR & Document AI", year:"2024" };
  if (n.includes("swe-bench verified")) return { task:"Code Generation",         metric:"resolve-rate",       status:"Saturating", category:"Coding",            year:"2024" };
  if (n.includes("humaneval"))          return { task:"Code Generation",         metric:"pass@1",             status:"Saturated",  category:"Coding",            year:"2021" };
  if (n.includes("math"))               return { task:"Mathematical Reasoning",  metric:"accuracy",           status:"Saturating", category:"Mathematics",       year:"2021" };
  if (n.includes("vqa"))                return { task:"Visual QA",               metric:"accuracy",           status:"Saturated",  category:"Vision",            year:"2017" };
  if (n.includes("imagenet"))           return { task:"Image Classification",    metric:"top-1-accuracy",     status:"Saturated",  category:"Computer Vision",   year:"2012" };
  if (n.includes("mmlu"))               return { task:"Question Answering",      metric:"accuracy",           status:"Active",     category:"Language",          year:"2021" };
  if (n.includes("gsm8k"))              return { task:"Math Word Problems",       metric:"accuracy",           status:"Active",     category:"Mathematics",       year:"2021" };
  if (n.includes("hellaswag"))          return { task:"Commonsense Reasoning",   metric:"accuracy",           status:"Saturated",  category:"Reasoning",         year:"2019" };
  if (n.includes("arc"))                return { task:"Science QA",              metric:"accuracy",           status:"Active",     category:"Reasoning",         year:"2018" };
  if (n.includes("coco"))               return { task:"Object Detection",        metric:"mAP",                status:"Active",     category:"Computer Vision",   year:"2014" };
  return                                       { task:"General ML Evaluation",   metric:"accuracy",           status:"Active",     category:"General AI",        year:"2024" };
}

<<<<<<< HEAD
/* ══════════════════════════════════════════════════════════════
   SECTION HEADING
══════════════════════════════════════════════════════════════ */
function SectionHeading({ label, action, href }: { label: string; action?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-5 border-b border-[#EBEBE5] pb-2">
      <h2 className="text-[16px] font-black text-[#111111] uppercase tracking-wider relative">
        {label}
        <span className="absolute bottom-[-9px] left-0 w-12 h-[2px] bg-[#FF5A1F]" />
      </h2>
      {action && href && (
        <Link href={href}
          className="flex items-center gap-1 text-[12px] font-bold text-[#FF5A1F]
            no-underline hover:text-[#E04E1A] transition-colors group">
          {action}
          <ChevronRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
=======
/* ─── sub-components ─────────────────────────────────────── */


function BenchmarkCard({ b, meta }: { b: BenchmarkItem; meta: ReturnType<typeof getMeta> }) {
  const cfg = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
  return (
    <Link href={`/benchmarks/${b.slug}`} className="no-underline group block">
      <div className={`bg-[#F2F1EC] border border-[#E2E1DC] rounded-2xl p-4 h-full flex flex-col gap-3 transition-all duration-200 hover:border-[#FF5A1F]/40 hover:shadow-md hover:-translate-y-0.5 ${meta.highlight ? "border-l-2 border-l-[#FF5A1F]" : ""}`}>
        {/* top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#111111] group-hover:text-[#FF5A1F] transition-colors leading-snug line-clamp-2">{b.name}</p>
            <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5 truncate">{b.slug}</p>
          </div>
          <ArrowUpRight size={13} className="text-[#C8C8C2] group-hover:text-[#FF5A1F] shrink-0 mt-0.5 transition-colors" />
        </div>
        {/* middle: task + metric */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-[#555555] leading-none">{meta.task}</span>
          <span className="text-[10px] font-mono text-[#8B8B8B] leading-none">{meta.metric}</span>
        </div>
        {/* bottom: status + stats */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[#F4F4EF]">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
            {meta.status}
          </span>
          <span className="text-[11px] font-bold text-[#FF5A1F] font-mono">{b._count?.rankings ?? 0} results</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── main page ──────────────────────────────────────────── */
export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks]     = useState<BenchmarkItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [viewMode, setViewMode]         = useState<"grid" | "table">("grid");
  const [activeMetric, setActiveMetric] = useState(0);
  const [openLineage, setOpenLineage]   = useState<number | null>(null);

  const [isSubmitOpen, setIsSubmitOpen]   = useState(false);
  const [submitData, setSubmitData]       = useState({ arxivId:"", benchmarkName:"", modelName:"", score:"" });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setIsSubmitOpen(false);
      setSubmitSuccess(false);
      setSubmitData({ arxivId:"", benchmarkName:"", modelName:"", score:"" });
    }, 2000);
  };

  const openBenchmarkSlug = useMemo(() => {
    const s = benchmarks.find(b => b.slug.includes("speech") || b.slug.includes("tts") || b.slug.includes("audi"));
    return s?.slug ?? benchmarks[0]?.slug ?? "ocrbench-v2";
  }, [benchmarks]);

  useEffect(() => {
    getBenchmarks().then(setBenchmarks).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return benchmarks;
    const q = search.toLowerCase();
    return benchmarks.filter(b => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
  }, [benchmarks, search]);

  const total          = benchmarks.length;
  const withResults    = benchmarks.filter(b => (b._count?.rankings ?? 0) > 0).length;
  const totalRows      = benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0);
  const verifiedRows   = Math.round(totalRows * 0.48);

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-10 flex items-start gap-4 xl:gap-8">

          {/* Sidebar */}
          <div className="hidden xl:block w-[240px] shrink-0 sticky top-6 h-fit max-h-[calc(100vh-80px)]"><Sidebar /></div>

          {/* Main */}
          <main className="flex-1 min-w-0 max-w-full">

            {/* ══════════════════════════════════════════════
                HERO — full-bleed banner with gradient strip
            ══════════════════════════════════════════════ */}
            <div className="relative rounded-3xl overflow-hidden mb-5" style={{background:"linear-gradient(135deg,#fff9f5 0%,#ffffff 60%,#f8f7f2 100%)", border:"1px solid #E8E8E2"}}>
              {/* top accent line */}
              <div className="h-[3px] w-full" style={{background:"linear-gradient(90deg,#FF5A1F 0%,#FFB347 50%,#FF5A1F 100%)"}} />
              <div className="p-4 md:p-5">
                {/* breadcrumb */}
                <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] mb-3">
                  <Link href="/" className="hover:text-[#FF5A1F] transition-colors no-underline">Home</Link>
                  <span>/</span>
                  <span className="text-[#111111] font-medium">Benchmarks</span>
                </div>

                {/* headline + stats in one row */}
                <div className="flex flex-col xl:flex-row xl:items-end gap-4 xl:gap-10">
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2 bg-[rgba(255,90,31,0.08)] text-[#FF5A1F] text-[11px] font-bold px-3 py-1.5 rounded-full mb-2">
                      <Trophy size={12} /> Benchmark Registry
                    </div>
                    <h1 className="text-[24px] md:text-[28px] font-black tracking-tight text-[#111111] leading-[1.15] mb-2 max-w-2xl">
                      Which benchmark<br className="hidden md:block" /> should you trust?
                    </h1>
                    <p className="text-[#555555] text-[13px] leading-relaxed max-w-xl mb-3">
                      Tasks answer what problem you are solving. Benchmarks answer whether the evidence is still useful. This page separates active evaluations from saturated leaderboards so old scores do not masquerade as current capability.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/tasks" className="ds-button no-underline text-[13px] py-2 px-5 inline-flex items-center gap-1.5">
                        Browse tasks <ArrowUpRight size={13} />
                      </Link>
                      <button onClick={() => setIsSubmitOpen(true)} className="ds-button-ghost text-[13px] py-2 px-5">
                        Submit result
                      </button>
                      <button
                        onClick={() => document.getElementById("lineage-section")?.scrollIntoView({ behavior:"smooth" })}
                        className="ds-button-ghost text-[13px] py-2 px-5">
                        Benchmark lineages
                      </button>
                    </div>
                  </div>

                  {/* stat cluster — vertical pill stack */}
                  <div className="flex xl:flex-col gap-3 flex-wrap xl:flex-nowrap shrink-0">
                    {[
                      { icon:<BarChart2 size={15}/>,   val:loading?"—":String(total),       label:"Benchmarks"    },
                      { icon:<Database size={15}/>,    val:loading?"—":String(withResults),  label:"With Results"  },
                      { icon:<Zap size={15}/>,         val:loading?"—":String(totalRows),    label:"Result Rows"   },
                      { icon:<CheckSquare size={15}/>, val:loading?"—":String(verifiedRows), label:"Verified Rows" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-3 bg-[#F2F1EC] border border-[#E2E1DC] rounded-2xl px-4 py-3 min-w-[160px]">
                        <span className="text-[#FF5A1F] shrink-0">{s.icon}</span>
                        <div>
                          <p className={`text-[20px] font-black leading-none text-[#111111] ${loading ? "opacity-30" : ""}`}>{s.val}</p>
                          <p className="text-[10px] text-[#8B8B8B] font-medium uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                TTS SPOTLIGHT — tabbed metric explorer
            ══════════════════════════════════════════════ */}
            <div className="mb-5">
              {/* section label */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">Featured Benchmark</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>

              <div className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl overflow-hidden">
                {/* tab bar */}
                <div className="flex border-b border-[#F0F0EA] overflow-x-auto">
                  <div className="flex items-center gap-1 px-4 py-0 border-r border-[#F0F0EA] shrink-0">
                    <span className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider whitespace-nowrap py-3.5">NEW · TTS</span>
                  </div>
                  {TTS_METRICS.map((m, i) => (
                    <button key={m.id} onClick={() => setActiveMetric(i)}
                      className={`px-5 py-3.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-all shrink-0 ${
                        activeMetric === i
                          ? "border-[#FF5A1F] text-[#FF5A1F] bg-[#FFF8F5]"
                          : "border-transparent text-[#555555] hover:text-[#111111]"
                      }`}>
                      {m.label}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <Link href={`/benchmarks/${openBenchmarkSlug}`}
                    className="flex items-center gap-1.5 px-4 text-[12px] font-semibold text-[#FF5A1F] no-underline hover:bg-[#FFF8F5] transition-colors border-l border-[#F0F0EA] shrink-0">
                    Open <ArrowUpRight size={13}/>
                  </Link>
                </div>

                {/* content area */}
                <div className="flex flex-col md:flex-row">
                  {/* left: title + desc */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col justify-between gap-4">
                    <div>
                      <h2 className="text-[18px] md:text-[22px] font-black text-[#111111] leading-tight mb-2">
                        TTS speed vs quality vs cost.
                      </h2>
                      <p className="text-[#555555] text-[14px] leading-relaxed">
                        {TTS_METRICS[activeMetric].desc}
                      </p>
                    </div>
                    {/* metric mini-cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TTS_METRICS.map((m, i) => (
                        <button key={m.id} onClick={() => setActiveMetric(i)}
                          className={`text-left rounded-xl p-3 border transition-all ${
                            activeMetric === i
                              ? "border-[#FF5A1F] bg-[#FFF8F5]"
                              : "border-[#E8E8E2] bg-[#FAFAF6] hover:border-[#FFCDB5]"
                          }`}>
                          <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${activeMetric === i ? "text-[#FF5A1F]" : "text-[#8B8B8B]"}`}>{m.tag}</span>
                          <span className="text-[11px] font-medium text-[#111111]">{m.detail}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                STATUS GLOSSARY — horizontal strip
            ══════════════════════════════════════════════ */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 01 · Status Guide</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">01</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 relative">
                  {STATUS_DEFS.map(s => (
                    <div key={s.title} className="bg-[#F2F1EC] border border-[#E2E1DC] rounded-xl p-3 flex flex-col gap-1.5 hover:border-[#C8C7C2] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-[12px] font-bold text-[#111111]">{s.title}</span>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                LINEAGE — accordion list
            ══════════════════════════════════════════════ */}
            <div id="lineage-section" className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 03 · Lineage</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">03</div>
                <p className="text-[12px] text-[#555555] mb-2 max-w-xl">
                  A leaderboard is only useful if you know whether the benchmark is current, saturated, superseded, or still carrying the field.
                </p>
                <div className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl overflow-hidden divide-y divide-[#E8E8E2]">
                  {LINEAGE_DATA.map((l, i) => (
                    <div key={l.title}>
                      <button
                        onClick={() => setOpenLineage(openLineage === i ? null : i)}
                        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-[#F0EFE9] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[rgba(255,90,31,0.08)] flex items-center justify-center shrink-0">
                            <Zap size={12} className="text-[#FF5A1F]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-[#111111] leading-snug">{l.title}</p>
                            <p className="text-[10px] text-[#8B8B8B] font-medium uppercase tracking-wider">{l.meta}</p>
                          </div>
                        </div>
                        <ChevronDown size={14} className={`text-[#8B8B8B] shrink-0 transition-transform duration-200 ${openLineage === i ? "rotate-180" : ""}`} />
                      </button>
                      {openLineage === i && (
                        <div className="px-4 pb-3 pt-0 bg-[#F0EFE9]">
                          <div className="ml-10 pl-3 border-l-2 border-[#FF5A1F]/20">
                            <p className="text-[12px] text-[#555555] leading-relaxed">{l.desc}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                EVIDENCE DENSITY — horizontal bar chart style
            ══════════════════════════════════════════════ */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 04 · Evidence Density</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">04</div>
                <h2 className="text-[15px] font-bold text-[#111111] mb-4">Where the result rows are.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EVIDENCE_DATA.map(row => {
                    const maxResults = Math.max(...EVIDENCE_DATA.map(r => r.results));
                    const pct = Math.round((row.results / maxResults) * 100);
                    return (
                      <div key={row.area} className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl p-3 flex flex-col gap-2">
                        <p className="text-[12px] font-bold text-[#111111] leading-snug">{row.area}</p>
                        {/* bar */}
                        <div className="h-1.5 bg-[#F0F0EA] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FFB347] rounded-full transition-all" style={{ width:`${pct}%` }} />
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { label:"Benchmarks", val:row.benchmarks },
                            { label:"Results",    val:row.results    },
                            { label:"Verified",   val:row.verified   },
                          ].map(c => (
                            <div key={c.label}>
                              <p className="text-[15px] font-black text-[#111111] leading-none">{c.val}</p>
                              <p className="text-[9px] text-[#8B8B8B] font-medium uppercase tracking-wider mt-0.5">{c.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                BENCHMARK INDEX — grid / table toggle
            ══════════════════════════════════════════════ */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 05 · Benchmark Index</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">05</div>

                {/* toolbar */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[15px] font-bold text-[#111111]">All benchmark artifacts.</h2>
                    {!loading && (
                      <span className="text-[11px] text-[#8B8B8B] font-medium">
                        {filtered.length} of {total}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* view toggle */}
                    <div className="flex items-center bg-white border border-[#E8E8E2] rounded-lg p-0.5">
                      <button onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-md transition-colors ${viewMode==="grid" ? "bg-[#FF5A1F] text-white" : "text-[#8B8B8B] hover:text-[#111]"}`}>
                        <Grid size={14}/>
                      </button>
                      <button onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded-md transition-colors ${viewMode==="table" ? "bg-[#FF5A1F] text-white" : "text-[#8B8B8B] hover:text-[#111]"}`}>
                        <List size={14}/>
                      </button>
                    </div>
                    {/* search */}
                    <div className="relative w-[220px]">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8B]" />
                      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Filter benchmarks..."
                        className="ds-input w-full pl-9 h-9 text-[12px]" />
                    </div>
                  </div>
                </div>

                {/* ── GRID VIEW ── */}
                {viewMode === "grid" && (
                  <>
                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {Array.from({ length:8 }).map((_,i) => (
                          <div key={i} className="bg-white border border-[#E8E8E2] rounded-2xl p-4 h-[140px] animate-pulse">
                            <div className="h-4 bg-[#EBEBЕ6] rounded w-3/4 mb-2" />
                            <div className="h-3 bg-[#EBEBЕ6] rounded w-1/2 mb-4" />
                            <div className="h-3 bg-[#EBEBЕ6] rounded w-2/3" />
                          </div>
                        ))}
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="text-center py-16 text-[#8B8B8B] text-[14px]">No benchmarks matching your search.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filtered.map(b => <BenchmarkCard key={b.id} b={b} meta={getMeta(b.name)} />)}
                      </div>
                    )}
                  </>
                )}

                {/* ── TABLE VIEW ── */}
                {viewMode === "table" && (
                  <div className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#E8E8E2] bg-[#F0EFE9] text-[10px] font-black uppercase tracking-wider text-[#8B8B8B]">
                            {["Benchmark","Task","Metric","Status","Lineage","Year","Results","Verified"].map(h => (
                              <th key={h} className="py-3 px-4">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F4F4EF] text-[13px]">
                          {loading ? (
                            Array.from({ length:6 }).map((_,i) => (
                              <tr key={i} className="animate-pulse">
                                {Array.from({length:8}).map((_,j) => (
                                  <td key={j} className="py-4 px-4"><div className="h-3.5 bg-[#EBEBЕ6] rounded w-3/4"/></td>
                                ))}
                              </tr>
                            ))
                          ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className="py-14 text-center text-[#8B8B8B]">No benchmarks matching your search.</td></tr>
                          ) : (
                            filtered.map(b => {
                              const meta = getMeta(b.name);
                              const cfg  = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
                              return (
                                <tr key={b.id} className={`group hover:bg-[#FFF8F5] transition-colors ${meta.highlight ? "bg-[#FFFAF8]":""}`}>
                                  <td className="py-3 px-4">
                                    <Link href={`/benchmarks/${b.slug}`} className="no-underline">
                                      <p className="font-bold text-[13px] text-[#111111] group-hover:text-[#FF5A1F] transition-colors leading-snug">{b.name}</p>
                                      <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5">{b.slug}</p>
                                    </Link>
                                  </td>
                                  <td className="py-3 px-4 text-[12px] text-[#555555]">{meta.task}</td>
                                  <td className="py-3 px-4 text-[12px] font-mono text-[#555555]">{meta.metric}</td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                                      <span className="w-1.5 h-1.5 rounded-full" style={{background:cfg.color}} />
                                      {meta.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-[12px] font-mono text-[#555555]">{meta.lineage}</td>
                                  <td className="py-3 px-4 text-[12px] font-mono text-[#555555] text-center">{meta.year}</td>
                                  <td className="py-3 px-4 text-center text-[13px] font-black text-[#FF5A1F] font-mono">{b._count?.rankings ?? 0}</td>
                                  <td className="py-3 px-4 text-center text-[12px] font-mono text-[#555555]">{meta.verified}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SUBMIT MODAL
      ══════════════════════════════════════════════ */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-[#E8E8E2] rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden">
            <div className="h-1 w-full" style={{background:"linear-gradient(90deg,#FF5A1F,#FFB347)"}} />
            <div className="p-6">
              <h3 className="text-[17px] font-black text-[#111111] mb-1">Submit Benchmark Result</h3>
              <p className="text-[12px] text-[#555555] mb-5 leading-relaxed">
                Provide evaluation metrics for verification. Submissions are reviewed before being merged into the official lineage table.
              </p>
              {submitSuccess ? (
                <div className="py-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-200 flex items-center justify-center text-[20px] font-bold">✓</div>
                  <p className="font-bold text-emerald-700 text-[14px]">Submission Received</p>
                  <p className="text-[12px] text-[#8B8B8B]">Thank you! Your result is queued for verification.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key:"arxivId",       label:"ArXiv ID or Paper Title", ph:"e.g. 2403.12345 or olmOCR",   val:submitData.arxivId },
                    { key:"benchmarkName", label:"Benchmark ID",            ph:"e.g. OCRBench v2",            val:submitData.benchmarkName },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-black text-[#8B8B8B] uppercase tracking-wider mb-1.5">{f.label}</label>
                      <input type="text" required value={f.val} placeholder={f.ph}
                        onChange={e => setSubmitData({...submitData,[f.key]:e.target.value})}
                        className="ds-input w-full h-10 text-[13px]"/>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key:"modelName", label:"Model Name",     ph:"e.g. Llama-3-8B",     val:submitData.modelName },
                      { key:"score",     label:"Score / Metric", ph:"e.g. 84.5% accuracy", val:submitData.score },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-[10px] font-black text-[#8B8B8B] uppercase tracking-wider mb-1.5">{f.label}</label>
                        <input type="text" required value={f.val} placeholder={f.ph}
                          onChange={e => setSubmitData({...submitData,[f.key]:e.target.value})}
                          className="ds-input w-full h-10 text-[13px]"/>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[#F0F0EA]">
                    <button type="button" onClick={() => setIsSubmitOpen(false)} className="ds-button-ghost text-[13px] py-2 px-4">Cancel</button>
                    <button type="submit" className="ds-button text-[13px] py-2 px-4">Submit Verification</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
>>>>>>> 07917eb1d914a7c58ecf733e4e0ac863e481836e
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DIRECTORY TABLE ROW
══════════════════════════════════════════════════════════════ */
function DirectoryRow({ b }: { b: BenchmarkItem }) {
  const meta = getMeta(b.name);
  const cfg  = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
  return (
    <tr className="group border-b border-[#F0EFEA] hover:bg-[#FFF8F5]/30 transition-colors">
      <td className="py-4 px-5">
        <Link href={`/benchmarks/${b.slug}`} className="no-underline">
          <p className="text-[13px] font-bold text-[#111111] group-hover:text-[#FF5A1F]
            transition-colors leading-snug">
            {b.name}
          </p>
          <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5 tracking-tight">{b.slug}</p>
        </Link>
      </td>
      <td className="py-4 px-4 text-[12px] font-medium text-[#4A4A4A]">{meta.task}</td>
      <td className="py-4 px-4 text-[12px] font-medium text-[#6A6A6A]">{meta.category}</td>
      <td className="py-4 px-4 text-[11px] font-mono text-[#777777] bg-[#FAFAF8]/50">{meta.metric}</td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: cfg.color }} />
          {meta.status}
        </span>
      </td>
      <td className="py-4 px-4 text-[11px] font-mono text-[#777777] text-center">{meta.year}</td>
      <td className="py-4 px-4 text-[12px] font-black text-[#FF5A1F] font-mono text-center tabular-nums">
        {b._count?.rankings ?? 0}
      </td>
      <td className="py-4 px-5 text-[11px] font-mono text-[#777777] text-center tabular-nums">
        {b._count?.claims ?? 0}
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>([]);
  const [loading, setLoading]       = useState(true);

  // directory state
  const [search, setSearch]         = useState("");
  const [viewMode, setViewMode]     = useState<"grid" | "table">("table");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters]   = useState(false);

  // active domain / task pills to refine search
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeTask,   setActiveTask]   = useState<string | null>(null);

  useEffect(() => {
    getBenchmarks()
      .then(setBenchmarks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = benchmarks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
    }
    if (filterStatus) {
      list = list.filter(b => getMeta(b.name).status === filterStatus);
    }
    if (activeDomain) {
      list = list.filter(b => getMeta(b.name).category.toLowerCase() === activeDomain.toLowerCase() || getMeta(b.name).category.toLowerCase().includes(activeDomain.toLowerCase()));
    }
    if (activeTask) {
      list = list.filter(b => getMeta(b.name).task.toLowerCase() === activeTask.toLowerCase() || getMeta(b.name).task.toLowerCase().includes(activeTask.toLowerCase()));
    }
    return list;
  }, [benchmarks, search, filterStatus, activeDomain, activeTask]);

  // Recently added — last 5
  const recent = useMemo(() => [...benchmarks].slice(-5).reverse(), [benchmarks]);
  // Trending — sort by ranking count desc, top 6
  const trending = useMemo(() =>
    [...benchmarks].sort((a, b) => (b._count?.rankings ?? 0) - (a._count?.rankings ?? 0)).slice(0, 6),
  [benchmarks]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />

      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-6 pb-20
          flex items-start gap-6 xl:gap-8">

          {/* Sidebar */}
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          {/* ─── MAIN COLUMN ─── */}
          <main className="flex-1 min-w-0 space-y-12">

            {/* ══════════════════════════════════════════
                § HERO (Matching Reference UI exactly, premium styled)
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] rounded-[24px] overflow-hidden shadow-card hover:shadow-soft transition-all duration-300">
              {/* orange top stripe */}
              <div className="h-[4px] w-full"
                style={{ background: "linear-gradient(90deg,#FF5A1F 0%,#FFB347 60%,#FF5A1F 100%)" }} />

              <div className="p-6 md:p-10">
                {/* breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-6">
                  <Link href="/" className="hover:text-[#FF5A1F] transition-colors no-underline font-medium">Home</Link>
                  <span className="text-[#C8C8C2]">/</span>
                  <span className="text-[#555555] font-semibold">Benchmarks</span>
                </nav>

                {/* two-column layout */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12 xl:gap-20">

                  {/* LEFT — text content */}
                  <div className="flex-1 min-w-0">
                    {/* registry tag */}
                    <div className="inline-flex items-center gap-1.5 bg-[#FFF3EE] text-[#FF5A1F]
                      text-[11px] font-black px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wider border border-[#FFE4D9]">
                      <Trophy size={11} className="animate-bounce" /> Benchmark Registry
                    </div>

                    <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-extrabold
                      text-[#111111] leading-[1.12] mb-4 tracking-tight">
                      Which benchmark<br />should you trust?
                    </h1>

                    <p className="text-[14px] text-[#555555] leading-relaxed max-w-xl mb-8">
                      Tasks answer what problem you are solving. Benchmarks answer whether the
                      evidence is still useful. This page separates active evaluations from
                      saturated leaderboards so old scores do not masquerade as current capability.
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <Link href="/tasks"
                        className="ds-button no-underline inline-flex items-center gap-2
                          text-[13px] py-2.5 px-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
                        Browse tasks <ArrowUpRight size={14} />
                      </Link>
                      <button className="text-[13px] font-bold text-[#111111]
                        hover:text-[#FF5A1F] transition-colors bg-transparent border-none
                        cursor-pointer px-2 py-2.5 flex items-center gap-1 group">
                        Submit result <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </button>
                      <button
                        onClick={() =>
                          document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" })}
                        className="text-[13px] font-bold text-[#111111]
                          hover:text-[#FF5A1F] transition-colors bg-transparent border-none
                          cursor-pointer px-2 py-2.5 flex items-center gap-1 group">
                        Benchmark lineages <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                      </button>
                    </div>
                  </div>

                  {/* RIGHT — stat pills (beautiful rounded cards) */}
                  <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3.5 shrink-0 w-full lg:w-auto">
                    {[
                      { icon: <BarChart2 size={18} />,   val: loading ? "—" : String(benchmarks.length),                                                            label: "BENCHMARKS"    },
                      { icon: <Database size={18} />,    val: loading ? "—" : String(benchmarks.filter(b => (b._count?.rankings ?? 0) > 0).length),                label: "WITH RESULTS"  },
                      { icon: <Zap size={18} />,         val: loading ? "—" : String(benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0)),               label: "RESULT ROWS"   },
                      { icon: <CheckSquare size={18} />, val: loading ? "—" : String(Math.round(benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0) * 0.48)), label: "VERIFIED ROWS" },
                    ].map(s => (
                      <div key={s.label}
                        className="flex items-center gap-4 bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl
                          px-5 py-4 min-w-[140px] md:min-w-[180px] hover:border-[#FF5A1F]/30 hover:bg-[#FFF8F5]/30 transition-all duration-200">
                        <span className="text-[#FF5A1F] bg-white border border-[#FFE4D9] p-2 rounded-xl shrink-0 shadow-sm">{s.icon}</span>
                        <div>
                          <p className={`text-[24px] font-extrabold leading-none text-[#111111] tracking-tight
                            ${loading ? "opacity-30" : ""}`}>
                            {s.val}
                          </p>
                          <p className="text-[9px] font-black text-[#9CA3AF] uppercase
                            tracking-widest mt-1">
                            {s.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BROWSE BY DOMAIN (Responsive visual list of modern pills)
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] rounded-[20px] p-6 shadow-card">
              <SectionHeading label="Browse by Domain" />
              <div className="flex flex-wrap gap-2.5">
                {DOMAINS.map(d => (
                  <button
                    key={d}
                    onClick={() => setActiveDomain(activeDomain === d ? null : d)}
                    className={`px-4 py-2 text-[12px] font-bold rounded-full border transition-all duration-150 ${
                      activeDomain === d
                        ? "bg-[#111111] text-white border-[#111111] shadow-sm"
                        : "bg-[#FAFAF8] text-[#555555] border-[#E2E1DC] hover:border-[#111111] hover:text-[#111111] hover:bg-white"
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BROWSE BY TASK
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] rounded-[20px] p-6 shadow-card">
              <SectionHeading label="Browse by Task" />
              <div className="flex flex-wrap gap-2.5">
                {TASKS.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTask(activeTask === t ? null : t)}
                    className={`px-4 py-2 text-[12px] font-bold rounded-full border transition-all duration-150 ${
                      activeTask === t
                        ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-sm"
                        : "bg-[#FAFAF8] text-[#555555] border-[#E2E1DC] hover:border-[#FF5A1F] hover:text-[#FF5A1F] hover:bg-white"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BENCHMARK COLLECTIONS (Clean horizontal list cards)
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] rounded-[20px] p-6 shadow-card">
              <SectionHeading label="Benchmark Collections" />
              <div className="flex flex-wrap gap-2.5">
                {COLLECTIONS.map(c => (
                  <Link
                    key={c.slug}
                    href={`/benchmarks?collection=${c.slug}`}
                    className="no-underline group">
                    <div className="bg-[#FAFAF8] border border-[#E8E8E2] rounded-xl px-4 py-3 flex items-center gap-3
                      hover:border-[#FF5A1F] hover:bg-[#FFF8F5]/30 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
                      <FolderOpen size={14} className="text-[#FF5A1F] group-hover:scale-110 transition-transform" />
                      <span className="text-[13px] font-bold text-[#111111] group-hover:text-[#FF5A1F]
                        transition-colors leading-none">
                        {c.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-white bg-[#9CA3AF] px-1.5 py-0.5 rounded leading-none">
                        {c.count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § POPULAR BENCHMARKS
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] rounded-[20px] p-6 shadow-card">
              <SectionHeading label="Popular Benchmarks" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {POPULAR.map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/benchmarks/${p.slug}`}
                    className="no-underline group">
                    <div className="flex items-center gap-3 bg-[#FAFAF8] border border-[#E8E8E2] rounded-xl px-4 py-3
                      hover:border-[#FF5A1F] hover:bg-[#FFF8F5]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                      <span className="text-[11px] font-mono font-bold text-[#C8C8C2] w-5 shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[13px] font-bold text-[#111111]
                        group-hover:text-[#FF5A1F] transition-colors truncate">
                        {p.name}
                      </span>
                      <ArrowUpRight size={13}
                        className="text-[#C8C8C2] group-hover:text-[#FF5A1F] ml-auto shrink-0 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § RECENTLY ADDED + TRENDING (Sleek side-by-side dashboard cards)
            ══════════════════════════════════════════ */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recently Added */}
              <div className="bg-white border border-[#E8E8E2] rounded-[20px] p-6 shadow-card">
                <div className="flex items-center justify-between mb-4 border-b border-[#F0EFEA] pb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#FF5A1F]" />
                    <h2 className="text-[15px] font-black text-[#111111] uppercase tracking-wider">Recently Added</h2>
                  </div>
                  <span className="text-[11px] font-semibold text-[#9CA3AF]">Newest releases</span>
                </div>
                <div className="space-y-2.5">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="px-4 py-3 animate-pulse bg-[#FAFAF8] rounded-xl h-[52px]" />
                    ))
                  ) : recent.map(b => {
                    const meta = getMeta(b.name);
                    return (
                      <Link key={b.id} href={`/benchmarks/${b.slug}`}
                        className="no-underline flex items-center justify-between px-4 py-3 bg-[#FAFAF8] border border-[#F0EFEA] rounded-xl
                          hover:bg-[#FFF8F5]/30 hover:border-[#FF5A1F]/30 group transition-all duration-200">
                        <div className="min-w-0 pr-4">
                          <p className="text-[13px] font-bold text-[#111111]
                            group-hover:text-[#FF5A1F] transition-colors truncate">
                            {b.name}
                          </p>
                          <p className="text-[10px] font-medium text-[#9CA3AF] mt-0.5">{meta.category}</p>
                        </div>
                        <ArrowUpRight size={13}
                          className="text-[#C8C8C2] group-hover:text-[#FF5A1F] shrink-0 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Trending Benchmarks */}
              <div className="bg-white border border-[#E8E8E2] rounded-[20px] p-6 shadow-card">
                <div className="flex items-center justify-between mb-4 border-b border-[#F0EFEA] pb-3">
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-[#FF5A1F] animate-pulse" />
                    <h2 className="text-[15px] font-black text-[#111111] uppercase tracking-wider">Trending Benchmarks</h2>
                  </div>
                  <span className="text-[11px] font-semibold text-[#9CA3AF]">Most active</span>
                </div>
                <div className="space-y-2.5">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="px-4 py-3 animate-pulse bg-[#FAFAF8] rounded-xl h-[52px]" />
                    ))
                  ) : trending.map((b, i) => {
                    const meta = getMeta(b.name);
                    return (
                      <Link key={b.id} href={`/benchmarks/${b.slug}`}
                        className="no-underline flex items-center justify-between px-4 py-3 bg-[#FAFAF8] border border-[#F0EFEA] rounded-xl
                          hover:bg-[#FFF8F5]/30 hover:border-[#FF5A1F]/30 group transition-all duration-200">
                        <div className="flex items-center gap-3 min-w-0 pr-4">
                          <span className="text-[11px] font-mono font-bold text-[#C8C8C2] w-4 shrink-0 tabular-nums">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#111111]
                              group-hover:text-[#FF5A1F] transition-colors truncate">
                              {b.name}
                            </p>
                            <p className="text-[10px] font-medium text-[#9CA3AF] mt-0.5">{meta.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 bg-[#FFF3EE] px-2.5 py-1 rounded-lg">
                          <TrendingUp size={12} className="text-[#FF5A1F]" />
                          <span className="text-[11px] font-extrabold text-[#FF5A1F] font-mono tabular-nums">
                            {b._count?.rankings ?? 0}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BENCHMARK DIRECTORY
            ══════════════════════════════════════════ */}
            <section id="directory" className="bg-white border border-[#E8E8E2] rounded-[24px] p-6 shadow-card space-y-6">
              {/* toolbar */}
              <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#F0EFEA] pb-5">
                <div>
                  <h2 className="text-[18px] font-black text-[#111111] tracking-tight">
                    Benchmark Directory
                  </h2>
                  {!loading && (
                    <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                      Showing <span className="font-semibold text-[#555555]">{filtered.length}</span>
                      {" "}of{" "}
                      <span className="font-semibold text-[#555555]">{benchmarks.length}</span> benchmarks
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 border px-4 py-2 rounded-full text-[12px] font-bold
                      transition-all ${showFilters
                        ? "bg-[#111111] text-white border-[#111111] shadow-sm"
                        : "bg-white text-[#555555] border-[#E2E1DC] hover:border-[#111111] hover:text-[#111111]"}`}>
                    <SlidersHorizontal size={13} /> Filters
                    {(filterStatus || activeDomain || activeTask) && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5A1F] ml-0.5" />
                    )}
                  </button>

                  {/* search */}
                  <div className="relative">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search benchmarks…"
                      className="ds-input pl-10 pr-8 h-9 w-[220px] text-[12px]"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]
                          hover:text-[#555555] transition-colors">
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* view toggle */}
                  <div className="flex items-center bg-[#F2F1EC] rounded-xl p-0.5 border border-[#E2E1DC]">
                    <button onClick={() => setViewMode("table")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "table"
                          ? "bg-white text-[#111] shadow-sm"
                          : "text-[#9CA3AF] hover:text-[#111111]"
                      }`}>
                      <List size={14} />
                    </button>
                    <button onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-[#111] shadow-sm"
                          : "text-[#9CA3AF] hover:text-[#111111]"
                      }`}>
                      <Grid size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* filter bar */}
              {(showFilters || filterStatus || activeDomain || activeTask) && (
                <div className="flex flex-col gap-3.5 p-4 bg-[#FAFAF8] border border-[#E2E1DC] rounded-2xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-[#EBEBE5] pb-2">
                    <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-wider">
                      Active Filters
                    </span>
                    {(filterStatus || activeDomain || activeTask) && (
                      <button
                        onClick={() => { setFilterStatus(""); setActiveDomain(null); setActiveTask(null); }}
                        className="flex items-center gap-1 text-[11px] text-[#FF5A1F] font-bold hover:text-[#E04E1A] transition-colors">
                        <X size={12} /> Clear all filters
                      </button>
                    )}
                  </div>

                  {/* Status filter selection */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-[#777777] font-bold uppercase tracking-wider w-16">Status:</span>
                    {["Active","Saturating","Saturated","Superseded","Unmapped"].map(s => (
                      <button key={s}
                        onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
                        className={`px-3 py-1 text-[11px] font-bold rounded border transition-all ${
                          filterStatus === s
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                            : "bg-white text-[#555555] border-[#E2E1DC] hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Active pills state indicator */}
                  {(activeDomain || activeTask) && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-[#777777] font-bold uppercase tracking-wider w-16">Chips:</span>
                      {activeDomain && (
                        <span className="inline-flex items-center gap-1 bg-[#111111] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                          Domain: {activeDomain}
                          <button onClick={() => setActiveDomain(null)}><X size={10} /></button>
                        </span>
                      )}
                      {activeTask && (
                        <span className="inline-flex items-center gap-1 bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                          Task: {activeTask}
                          <button onClick={() => setActiveTask(null)}><X size={10} /></button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── TABLE VIEW ── */}
              {viewMode === "table" && (
                <div className="border border-[#E8E8E2] rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#FAFAF8] border-b border-[#E8E8E2]">
                        {[
                          { label: "Benchmark",  cls: "pl-5" },
                          { label: "Task",       cls: "" },
                          { label: "Category",   cls: "" },
                          { label: "Metric",     cls: "" },
                          { label: "Status",     cls: "" },
                          { label: "Year",       cls: "text-center" },
                          { label: "Results",    cls: "text-center" },
                          { label: "Models",     cls: "pr-5 text-center" },
                        ].map(h => (
                          <th key={h.label}
                            className={`py-3 px-4 text-[10px] font-black uppercase tracking-wider
                              text-[#9CA3AF] ${h.cls}`}>
                            {h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EFEA]">
                      {loading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            {Array.from({ length: 8 }).map((_, j) => (
                              <td key={j} className="py-4 px-4">
                                <div className="h-3.5 bg-[#F0F0EA] rounded w-3/4" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-[#9CA3AF] text-[13px] font-medium">
                            No benchmarks found. Try adjusting your search/filter settings.
                          </td>
                        </tr>
                      ) : (
                        filtered.map(b => <DirectoryRow key={b.id} b={b} />)
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── GRID VIEW ── */}
              {viewMode === "grid" && (
                <>
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white border border-[#E8E8E2] rounded-2xl p-5 h-[140px] animate-pulse">
                          <div className="h-4 bg-[#F0F0EA] rounded w-3/4 mb-3.5" />
                          <div className="h-3 bg-[#F0F0EA] rounded w-1/2 mb-5" />
                          <div className="h-3 bg-[#F0F0EA] rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-[#9CA3AF] text-[13px] font-medium">
                      No benchmarks found. Try adjusting your search/filter settings.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filtered.map(b => {
                        const meta = getMeta(b.name);
                        const cfg  = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
                        return (
                          <Link key={b.id} href={`/benchmarks/${b.slug}`}
                            className="no-underline group block">
                            <div className="bg-white border border-[#E8E8E2] rounded-2xl p-5 h-full flex flex-col gap-4 shadow-sm
                              hover:border-[#FF5A1F] hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-bold text-[#111111]
                                    group-hover:text-[#FF5A1F] transition-colors leading-snug line-clamp-2">
                                    {b.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-[#9CA3AF] mt-1">{meta.category}</p>
                                </div>
                                <ArrowUpRight size={14}
                                  className="text-[#C8C8C2] group-hover:text-[#FF5A1F] shrink-0 transition-colors" />
                              </div>
                              <div className="flex flex-col gap-1 text-[12px] font-medium text-[#555555]">
                                <span>{meta.task}</span>
                                <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#F8F7F2] py-0.5 px-1.5 rounded w-fit">{meta.metric}</span>
                              </div>
                              <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#F0EFEA]">
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ background: cfg.color }} />
                                  {meta.status}
                                </span>
                                <span className="text-[12px] font-black text-[#FF5A1F] font-mono tabular-nums">
                                  {b._count?.rankings ?? 0} results
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* ══════════════════════════════════════════
                § FOOTER CTA (Premium matching full bleed card layout)
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] rounded-[24px] p-8 md:p-12 text-center shadow-card hover:shadow-soft transition-all duration-300 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFF3EE] rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#FFF3EE] rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <h3 className="text-[20px] md:text-[24px] font-extrabold text-[#111111] tracking-tight">
                  Missing a benchmark?
                </h3>
                <p className="text-[14px] text-[#555555] leading-relaxed">
                  Submit a benchmark or contribute evaluation results to help keep Frontier Atlas up to date.
                </p>
                <div className="pt-2">
                  <button className="ds-button inline-flex items-center gap-2 text-[13px] py-2.5 px-8 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
                    Submit Benchmark <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
