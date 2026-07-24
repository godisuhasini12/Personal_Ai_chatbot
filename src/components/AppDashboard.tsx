import React from "react";
import { PageId } from "../types";
import { ROADMAP_PHASES } from "../data/roadmap";
import {
  Mail,
  FileText,
  Users,
  CheckSquare,
  PenTool,
  Type,
  FileSearch,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

import heroImg from "../assets/images/productivity_agent_hero_1784867413345.jpg";

interface AppDashboardProps {
  setActivePage: (page: PageId) => void;
}

const QUICK_TOOLS: {
  id: PageId;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  badgeBg: string;
}[] = [
  {
    id: "email generator",
    title: "Draft Emails",
    badge: "Email Assistant",
    description: "Compose tailored cold emails, client outreach, or replies in seconds.",
    icon: <Mail className="w-5 h-5 text-indigo-600" />,
    accent: "border-indigo-200 hover:border-indigo-400 bg-indigo-50/30",
    badgeBg: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "email summarizer",
    title: "Summarize Long Emails",
    badge: "Smart Summaries",
    description: "Extract key takeaways, action items, sentiment & quick replies from threads.",
    icon: <FileText className="w-5 h-5 text-blue-600" />,
    accent: "border-blue-200 hover:border-blue-400 bg-blue-50/30",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "meeting notes",
    title: "Generate Meeting Notes",
    badge: "Meeting Notes",
    description: "Convert raw transcriptions into structured decisions, tasks, and deadlines.",
    icon: <Users className="w-5 h-5 text-purple-600" />,
    accent: "border-purple-200 hover:border-purple-400 bg-purple-50/30",
    badgeBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "task planner",
    title: "Plan Tasks & Goals",
    badge: "Task Planner",
    description: "Deconstruct complex goals into phased actionable roadmaps with time estimates.",
    icon: <CheckSquare className="w-5 h-5 text-emerald-600" />,
    accent: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/30",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "content creator",
    title: "Create Content in Seconds",
    badge: "Content Creator",
    description: "Generate engaging posts for LinkedIn, Twitter, Instagram, blogs & newsletters.",
    icon: <PenTool className="w-5 h-5 text-amber-600" />,
    accent: "border-amber-200 hover:border-amber-400 bg-amber-50/30",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "grammar rewriter",
    title: "Rewrite & Polish Text",
    badge: "Grammar Rewriter",
    description: "Refine tone, improve clarity, adjust formality, and eliminate grammatical errors.",
    icon: <Type className="w-5 h-5 text-teal-600" />,
    accent: "border-teal-200 hover:border-teal-400 bg-teal-50/30",
    badgeBg: "bg-teal-100 text-teal-700",
  },
  {
    id: "pdf summarizer",
    title: "Summarize Documents & PDFs",
    badge: "PDF Notes",
    description: "Upload PDFs or documents to instantly extract executive summaries and Q&A.",
    icon: <FileSearch className="w-5 h-5 text-rose-600" />,
    accent: "border-rose-200 hover:border-rose-400 bg-rose-50/30",
    badgeBg: "bg-rose-100 text-rose-700",
  },
];

export const AppDashboard: React.FC<AppDashboardProps> = ({ setActivePage }) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-800">
            Personal AI Productivity & Automation Agent
          </h1>
        </div>
        <p className="text-slate-600 text-sm sm:text-base">
          Boost your productivity with AI-powered automation.
        </p>
      </div>

      {/* Hero Infographic Banner & Roadmap Section (Matching Screenshot) */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Visual Banner & Callouts */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your All-in-One AI Assistant for Work & Daily Tasks</span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-700/60 shadow-lg group">
                <img
                  src={heroImg}
                  alt="Personal AI Productivity & Automation Agent Banner"
                  className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-4">
                  <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>Let AI handle the busywork, so you can focus on what matters!</span>
                  </p>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: "Email Assistant", color: "bg-indigo-500/20 text-indigo-200 border-indigo-500/30" },
                  { label: "Meeting Notes", color: "bg-purple-500/20 text-purple-200 border-purple-500/30" },
                  { label: "Task Planner", color: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30" },
                  { label: "Content Creator", color: "bg-amber-500/20 text-amber-200 border-amber-500/30" },
                  { label: "Smart Summaries", color: "bg-blue-500/20 text-blue-200 border-blue-500/30" },
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Boost Productivity. Save Time. Get More Done.</span>
              </span>
              <span className="text-emerald-400 font-semibold">100% Active</span>
            </div>
          </div>

          {/* Right Column: Project Roadmap (Phases 1-14) */}
          <div className="lg:col-span-5 bg-slate-950/90 p-6 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base uppercase tracking-wider">
                  PROJECT ROADMAP
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                14 PHASES
              </span>
            </div>

            {/* Scrollable Phases List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar text-xs">
              {ROADMAP_PHASES.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  onClick={() => phase.targetTool && setActivePage(phase.targetTool)}
                  className="group flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {phase.phaseNumber}
                    </span>
                    <div className="truncate">
                      <p className="font-semibold text-slate-200 text-xs truncate group-hover:text-emerald-400 transition-colors">
                        {phase.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{phase.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-sm">{phase.icon}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Tool Modules</h2>
            <p className="text-xs text-slate-500">Select any module to start automating your workflows</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setActivePage(tool.id)}
              className={`group p-5 rounded-xl border bg-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${tool.accent}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                    {tool.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${tool.badgeBg}`}>
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-emerald-700">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
