"use client";

import { useEffect, useState } from "react";
import {
  Flame,
  Clock,
  Star,
  Bot,
  Brain,
  MessageSquare,
  Code2,
  Monitor,
  Globe,
  Cpu,
  Zap,
  Link,
  RefreshCw,
  Layers,
  BarChart2,
  Target,
  Plug,
  FileText,
  ImageIcon,
  Video,
  Volume2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ============ Types ============
interface NavItemData {
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onItemClick?: () => void;
  onItemSelect?: (item: string) => void;
  initialActive?: string;
}

// ============ Constants ============
const NAV_SECTIONS = {
  DISCOVER: [
    { label: "Trending Papers", icon: Flame },
    { label: "Latest Papers", icon: Clock },
    { label: "Most GitHub Stars", icon: Star },
  ],
  TASKS: [
    { label: "Agents", icon: Bot },
    { label: "Reasoning", icon: Brain },
    { label: "Language Modeling", icon: MessageSquare },
    { label: "Coding Agents", icon: Code2 },
    { label: "Computer Use", icon: Monitor },
    { label: "World Models", icon: Globe },
    { label: "Robotics", icon: Cpu },
  ],
  METHODS: [
    { label: "Transformer", icon: Zap },
    { label: "Chain of Thought", icon: Link },
    { label: "ReAct", icon: RefreshCw },
    { label: "LoRA", icon: Layers },
    { label: "RLHF", icon: BarChart2 },
    { label: "DPO", icon: Target },
    { label: "MCP", icon: Plug },
  ],
  GENERATION: [
    { label: "Text Generation", icon: FileText },
    { label: "Image Generation", icon: ImageIcon },
    { label: "Video Generation", icon: Video },
    { label: "Audio Generation", icon: Volume2 },
  ],
} as const;

// ============ Sub-Components ============
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold text-[#8B8B8B] uppercase tracking-[0.08em] px-3 mb-[2px] mt-[4px] first:mt-0">
    {children}
  </p>
);

const NavItem = ({
  icon,
  label,
  isActive = false,
  onClick,
  showArrow = false,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  showArrow?: boolean;
}) => {
  const IconWrapper = icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 px-3 py-[3.5px] mx-2 cursor-pointer transition-colors text-[14px] font-medium leading-tight",
        isActive ? "text-[#F55036]" : "text-[#555555] hover:text-[#F55036]",
      )}
    >
      <span className="w-4 h-4 flex items-center justify-center text-[16px] shrink-0">
        {IconWrapper}
      </span>
      <span className="truncate flex-1">{label}</span>
      {showArrow && (
        <ArrowRight
          size={14}
          className={cn(
            "transition-all duration-200 opacity-0 -translate-x-2",
            "group-hover:opacity-100 group-hover:translate-x-0",
            "group-hover:text-[#F55036]",
          )}
        />
      )}
    </div>
  );
};

const NavSection = ({
  title,
  items,
  activeItem,
  onItemClick,
}: {
  title: string;
  items: readonly { label: string; icon: React.ElementType }[];
  activeItem: string;
  onItemClick: (label: string) => void;
}) => (
  <div className="flex flex-col">
    <SectionLabel>{title}</SectionLabel>
    {items.map(({ label, icon: Icon }) => (
      <NavItem
        key={label}
        icon={
          <Icon
            size={14}
            className={activeItem === label ? "text-[#F55036]" : ""}
          />
        }
        label={label}
        isActive={activeItem === label}
        onClick={() => onItemClick(label)}
      />
    ))}
  </div>
);

// ============ Main Component ============
export default function Sidebar({
  onItemClick,
  onItemSelect,
  initialActive = "Trending Papers",
}: SidebarProps) {
  const [activeItem, setActiveItem] = useState(initialActive);
  const router = useRouter();

  useEffect(() => {
    setActiveItem(initialActive);
  }, [initialActive]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    onItemSelect?.(label);
    onItemClick?.();
  };

  return (
    <aside className="flex flex-col w-full bg-transparent overflow-hidden">
      <div className="flex flex-col gap-2">
        {Object.entries(NAV_SECTIONS).map(([title, items]) => (
          <NavSection
            key={title}
            title={title}
            items={items}
            activeItem={activeItem}
            onItemClick={handleItemClick}
          />
        ))}

        {/* All Domains - Special Item */}
        <div className="flex flex-col pt-3">
          <NavItem
            icon={<div />}
            label="All Domains"
            isActive={activeItem === "All Domains"}
            onClick={() => {
              router.push("/tasks");
            }}
            showArrow={true}
          />
        </div>
      </div>
    </aside>
  );
}
