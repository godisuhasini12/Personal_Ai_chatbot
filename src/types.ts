export type PageId =
  | "app"
  | "email generator"
  | "email summarizer"
  | "meeting notes"
  | "task planner"
  | "content creator"
  | "grammar rewriter"
  | "pdf summarizer"
  | "settings";

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  icon: string;
  status: "Completed" | "In Progress" | "Planned";
  description: string;
  targetTool?: PageId;
}

export interface EmailGenerateResult {
  subject: string;
  body: string;
  keyHighlights?: string[];
  suggestedFollowUp?: string;
}

export interface EmailSummarizeResult {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: string;
  quickReplies: string[];
}

export interface MeetingNotesResult {
  title: string;
  executiveSummary: string;
  keyDecisions: string[];
  actionItems: {
    task: string;
    assignee: string;
    priority: "High" | "Medium" | "Low";
    deadline: string;
  }[];
  openQuestions?: string[];
  nextSteps?: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  estimatedHours: number;
  priority: "High" | "Medium" | "Low";
  subtasks: string[];
  completed?: boolean;
}

export interface TaskPhase {
  phaseName: string;
  description: string;
  tasks: TaskItem[];
}

export interface TaskPlannerResult {
  projectTitle: string;
  overview: string;
  phases: TaskPhase[];
}

export interface ContentCreatorResult {
  headline: string;
  content: string;
  hashtags: string[];
  mediaIdeas: string[];
}

export interface GrammarRewriterResult {
  rewrittenText: string;
  improvementsMade: string[];
  toneAnalysis?: string;
  alternativeVersion?: string;
}

export interface PdfSummarizerResult {
  title?: string;
  executiveSummary: string;
  keyTakeaways: string[];
  sectionsBreakdown?: {
    heading: string;
    summary: string;
  }[];
  keyTerms?: string[];
}

export interface SavedHistoryItem {
  id: string;
  timestamp: string;
  tool: PageId;
  title: string;
  preview: string;
  data: any;
}

export interface AppSettings {
  selectedModel: string;
  defaultTone: string;
  systemPromptCustom: string;
  autoSaveHistory: boolean;
}
