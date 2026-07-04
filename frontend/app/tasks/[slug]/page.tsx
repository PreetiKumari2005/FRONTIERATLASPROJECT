import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import { getPapers, type GetPapersResult } from "@/lib/paperApi";

export const dynamic = "force-dynamic";

type TaskPageProps = {
  params: Promise<{ slug: string }>;
};

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Task metadata
const getTaskMetadata = (slug: string) => {
  const displayName = formatSlug(slug);

  return {
    displayName,
    title: displayName.toUpperCase(),
    description: `AI agents are autonomous software systems that use artificial intelligence to achieve goals and complete tasks on behalf of users. They perceive their environment, make decisions, and act independently using reasoning, memory, planning, and learning capabilities powered by LLMs and other AI tools.`,
    stats: {
      benchmarks: 15,
      methods: "8+",
    },
    sisterTasks: [
      { name: "Coding Agents", count: 317 },
      { name: "Computer Use Agents", count: 289 },
      { name: "Language Modeling", count: 412 },
    ],
  };
};

export default async function TaskPage({ params }: TaskPageProps) {
  const { slug } = await params;
  const metadata = getTaskMetadata(slug);

  let initialPapers: GetPapersResult | null = null;
  let error: string | null = null;

  try {
    initialPapers = await getPapers({
      page: 1,
      task: slug,
    });
  } catch (err) {
    console.error(`Failed to fetch papers for task "${slug}":`, err);
    error = "Failed to load papers. Please try again later.";
  }

  const paperCount = initialPapers?.total ?? initialPapers?.papers?.length ?? 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />

      <div
        id="scroll-container"
        className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 xl:px-14 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] tracking-wide text-[#7B736A] mb-8">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tasks" className="hover:text-black transition-colors">
              Tasks
            </Link>
            <span>/</span>
            <span className="text-[#0E4B8E] uppercase font-medium">
              {metadata.title}
            </span>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_460px] gap-12 items-start">
            {/* Left Content */}
            <div className="max-w-[720px]">
              {/* Task Title */}
              <div className="mt-2">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#0E4B8E] font-medium mb-3">
                  TASK
                </p>
                <h1 className="text-[72px] leading-none font-black tracking-tighter text-[#1A1A1A]">
                  {metadata.title}
                </h1>
              </div>

              {/* Description */}
              <p className="mt-8 text-[14px] leading-[1.5rem] text-[#222222]">
                {metadata.description}
              </p>

              {/* Stats */}
              <div className="mt-10">
                <div className="flex flex-wrap items-center gap-x-12 gap-y-8">
                  <Stat label="Papers" value={paperCount} />
                  <Stat label="Benchmarks" value={metadata.stats.benchmarks} />
                  <Stat label="Methods Used" value={metadata.stats.methods} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#D7D2CA] mt-5" />

              {/* Sister Tasks */}
              <div className="mt-4">
                <div className="flex items-center flex-wrap gap-x-4 gap-y-3">
                  <p className="text-[12px] uppercase text-[#7B736A] tracking-[0.10em] font-semibold whitespace-nowrap">
                    SISTER TASKS
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {metadata.sisterTasks.map((task, idx) => (
                      <SisterTaskTag
                        key={idx}
                        name={task.name}
                        count={task.count}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="w-full max-w-[480px] xl:mt-4">
              <div className="h-[320px] rounded-2xl border border-[#DDD6CC] bg-white overflow-hidden relative">
                <Image
                  src="https://paperswithcode.co/api/v1/tasks/agents/image?v=1781525141"
                  alt="Agent Architecture Diagram"
                  fill
                  className="object-contain p-6"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Papers Section */}
        {/* Main Content Area with Left & Right Columns */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-12">
          <div className="flex flex-col xl:flex-row items-start gap-8 xl:gap-10">
            {/* LEFT: Papers Section */}
            <main className="flex-1 min-w-0 w-full">
              <PaperTabs />
              <PaperList
                selectedTag={metadata.displayName}
                initialPapers={initialPapers}
                initialError="Failed to load papers. Please try again later."
              />
            </main>

            {/* RIGHT: Sidebar - Common Methods + Image */}
            {/* RIGHT SIDEBAR */}
            <aside className="w-full xl:w-[380px] flex-shrink-0 space-y-12">
              {/* 01 / SISTER TASKS */}
              <div>
                <div className="block items-baseline gap-3 mb-4">
                  <span className="text-[13px] font-mono text-[#7B736A]">
                    01/
                  </span>
                  <h3 className="text-[13px] uppercase py-1 tracking-[0.08em] text-[#000] font-semibold border-b border-1 border-[#D7D2CA]">
                    SISTER TASKS
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Coding Agents", count: 317 },
                    { name: "Computer Use Agents", count: 317 },
                    { name: "Language Modeling", count: "37,119" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-1 group cursor-pointer"
                    >
                      <span className="text-[14px] text-[#333] group-hover:text-[#F55036] px-3 py-1 rounded-[10px] transition-all font-semibold">
                        {item.name}
                      </span>
                      <span className="font-medium text-[#8D857B] tabular-nums">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 02 / COMMON METHODS */}
              <div>
                <div className="block items-baseline gap-3 mb-4">
                  <span className="text-[13px] font-mono text-[#7B736A]">
                    02/
                  </span>
                  <h3 className="text-[13px] uppercase py-1 tracking-[0.08em] text-[#000] font-semibold border-b border-1 border-[#D7D2CA]">
                    COMMON METHODS
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Large language model (LLM)", count: -10 },
                    { name: "Mixture-of-Experts (MoE)", count: -8 },
                    { name: "Transformer", count: -8 },
                    { name: "Qwen3", count: -5 },
                    { name: "Post-training", count: -4 },
                    { name: "GRPO", count: -3 },
                    { name: "DeepSeek Sparse Attention", count: -2 },
                    { name: "MCP", count: -2 },
                  ].map((method, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-1 group"
                    >
                      <span className="cursor-pointer text-[12px] text-[#333] border border-black border-opacity-30 group-hover:border-opacity-100 bg-white px-3 py-1 rounded-[6px] transition-all hover:bg-transparent hover:border-[#F55036]">
                        {method.name}
                      </span>
                      <span className="font-medium text-[#8D857B] tabular-nums">
                        {method.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================== Sub Components ====================== */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-end gap-2">
      <span className="text-[13px] font-bold text-[#111] tabular-nums">
        {value}{" "}
        <span className="uppercase tracking-[0.18em] text-[#7B736A] ml-2">
          {label}
        </span>
      </span>
    </div>
  );
}

function SisterTaskTag({ name, count }: { name: string; count: number }) {
  return (
    <span className="cursor-pointer inline-flex items-center rounded-full border border-[#DDD6CC] bg-white px-4 py-1 text-[13px] text-[#333] transition hover:bg-transparent hover:border-[#F55036]">
      {name}
      <span className="ml-1.5 text-[#8D857B] font-medium tabular-nums">
        ({count})
      </span>
    </span>
  );
}
