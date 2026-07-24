import React from "react";
import { PageId } from "../types";
import {
  LayoutDashboard,
  Mail,
  FileText,
  Users,
  CheckSquare,
  PenTool,
  Type as TypeIcon,
  FileSearch,
  Settings as SettingsIcon,
  Bot,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NAV_ITEMS: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: "app", label: "app", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "email generator", label: "email generator", icon: <Mail className="w-4 h-4" /> },
  { id: "email summarizer", label: "email summarizer", icon: <FileText className="w-4 h-4" /> },
  { id: "meeting notes", label: "meeting notes", icon: <Users className="w-4 h-4" /> },
  { id: "task planner", label: "task planner", icon: <CheckSquare className="w-4 h-4" /> },
  { id: "content creator", label: "content creator", icon: <PenTool className="w-4 h-4" /> },
  { id: "grammar rewriter", label: "grammar rewriter", icon: <TypeIcon className="w-4 h-4" /> },
  { id: "pdf summarizer", label: "pdf summarizer", icon: <FileSearch className="w-4 h-4" /> },
  { id: "settings", label: "settings", icon: <SettingsIcon className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
}) => {
  const handleSelect = (page: PageId) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-50 border-r border-slate-200 text-slate-700 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm leading-tight">
                Streamlit AI Suite
              </h2>
              <span className="text-[11px] text-slate-500">v1.0.0 • Local 8501</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              PAGES
            </span>
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id.replace(/\s+/g, "-")}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                  isActive
                    ? "bg-slate-200/80 text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className={isActive ? "text-emerald-600" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span className="capitalize">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info (Matches Streamlit image) */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-100/60 text-xs space-y-3">
          <div className="flex items-start gap-2 text-slate-800 font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="leading-tight">Personal AI Productivity & Automation Agent</p>
              <p className="text-[11px] font-normal text-slate-500 mt-0.5">Version 1.0.0</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <p className="font-medium text-slate-700 mb-0.5">Navigation</p>
            This application uses multi-page navigation. Select any tool above to access AI features.
          </div>
        </div>
      </aside>
    </>
  );
};
