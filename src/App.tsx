import React, { useState } from "react";
import { PageId } from "./types";
import { Sidebar } from "./components/Sidebar";
import { AppDashboard } from "./components/AppDashboard";
import { EmailGenerator } from "./components/EmailGenerator";
import { EmailSummarizer } from "./components/EmailSummarizer";
import { MeetingNotes } from "./components/MeetingNotes";
import { TaskPlanner } from "./components/TaskPlanner";
import { ContentCreator } from "./components/ContentCreator";
import { GrammarRewriter } from "./components/GrammarRewriter";
import { PdfSummarizer } from "./components/PdfSummarizer";
import { Settings } from "./components/Settings";
import { Menu, Bot } from "lucide-react";

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("app");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "app":
        return <AppDashboard setActivePage={setActivePage} />;
      case "email generator":
        return <EmailGenerator />;
      case "email summarizer":
        return <EmailSummarizer />;
      case "meeting notes":
        return <MeetingNotes />;
      case "task planner":
        return <TaskPlanner />;
      case "content creator":
        return <ContentCreator />;
      case "grammar rewriter":
        return <GrammarRewriter />;
      case "pdf summarizer":
        return <PdfSummarizer />;
      case "settings":
        return <Settings />;
      default:
        return <AppDashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Mobile Header (Streamlit bar style) */}
      <header className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between lg:hidden sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-200/80 transition-colors"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm truncate">
              Personal AI Agent
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Deploy
        </span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Streamlit-Style Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
