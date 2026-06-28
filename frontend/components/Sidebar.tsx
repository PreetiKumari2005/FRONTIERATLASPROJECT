"use client";

import { useState } from "react";
import {
  Flame, Clock, Star, Bot, Brain, MessageSquare, Code2,
  Monitor, Globe, Cpu, Zap, Link, RefreshCw, Layers,
  BarChart2, Target, Plug, FileText, ImageIcon, Video, Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold text-[#8B8B8B] uppercase tracking-[0.08em] px-3 mb-0.5 mt-2 first:mt-1">
      {children}
    </p>
  );
}

function NavItem({
  icon,
  label,
  isActive = false,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-[4px] mx-2 cursor-pointer transition-colors text-[11px] font-medium",
        isActive
          ? "text-[#F55036] font-bold"
          : "text-[#555555] hover:text-[#F55036]"
      )}
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center text-[13px] shrink-0">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Trending Papers");

  const discover = [
    { label: "Trending Papers", icon: <Flame size={14} className={activeItem === "Trending Papers" ? "text-[#F55036] fill-[#F55036]" : ""} /> },
    { label: "Latest Papers", icon: <Clock size={14} /> },
    { label: "Most GitHub Stars", icon: <Star size={14} /> },
  ];

  const tasks = [
    { label: "Agents", icon: <Bot size={14} /> },
    { label: "Reasoning", icon: <Brain size={14} /> },
    { label: "Language Modeling", icon: <MessageSquare size={14} /> },
    { label: "Coding Agents", icon: <Code2 size={14} /> },
    { label: "Computer Use", icon: <Monitor size={14} /> },
    { label: "World Models", icon: <Globe size={14} /> },
    { label: "Robotics", icon: <Cpu size={14} /> },
  ];

  const methods = [
    { label: "Transformer", icon: <Zap size={14} /> },
    { label: "Chain of Thought", icon: <Link size={14} /> },
    { label: "ReAct", icon: <RefreshCw size={14} /> },
    { label: "LoRA", icon: <Layers size={14} /> },
    { label: "RLHF", icon: <BarChart2 size={14} /> },
    { label: "DPO", icon: <Target size={14} /> },
    { label: "MCP", icon: <Plug size={14} /> },
  ];

  const generation = [
    { label: "Text Generation", icon: <FileText size={14} /> },
    { label: "Image Generation", icon: <ImageIcon size={14} /> },
    { label: "Video Generation", icon: <Video size={14} /> },
    { label: "Audio Generation", icon: <Volume2 size={14} /> },
  ];

  return (
    <aside className="w-[240px] shrink-0 bg-[#F8F7F2] border-r border-[#E5E5E0] overflow-hidden py-2 pl-6">
      <SectionLabel>DISCOVER</SectionLabel>
      {discover.map((item) => (
        <NavItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          isActive={activeItem === item.label}
          onClick={() => setActiveItem(item.label)}
        />
      ))}

      <SectionLabel>TASKS</SectionLabel>
      {tasks.map((item) => (
        <NavItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          isActive={activeItem === item.label}
          onClick={() => setActiveItem(item.label)}
        />
      ))}

      <SectionLabel>METHODS</SectionLabel>
      {methods.map((item) => (
        <NavItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          isActive={activeItem === item.label}
          onClick={() => setActiveItem(item.label)}
        />
      ))}

      <SectionLabel>GENERATION</SectionLabel>
      {generation.map((item) => (
        <NavItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          isActive={activeItem === item.label}
          onClick={() => setActiveItem(item.label)}
        />
      ))}
    </aside>
  );
}
