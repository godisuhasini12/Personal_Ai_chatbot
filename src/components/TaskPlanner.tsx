import React, { useState } from "react";
import { TaskPlannerResult, TaskPhase, TaskItem } from "../types";
import { CheckSquare, Sparkles, Copy, Check, Plus, Trash2, RefreshCw, AlertCircle, Download } from "lucide-react";

const SAMPLES = [
  {
    goal: "Build and Launch a SaaS MVP in 30 Days",
    timeframe: "30 days",
    teamSize: "2 engineers + 1 designer",
  },
  {
    goal: "Migrate On-Prem Data Warehouse to AWS Redshift",
    timeframe: "6 weeks",
    teamSize: "Data Team (4 people)",
  },
  {
    goal: "Plan and Execute Annual Tech Summit Conference",
    timeframe: "3 months",
    teamSize: "Marketing & Ops (5 people)",
  },
];

export const TaskPlanner: React.FC = () => {
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("2 weeks");
  const [teamSize, setTeamSize] = useState("1-2 people");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaskPlannerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Local state for checking off tasks
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/task-planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, timeframe, teamSize }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate project plan.");
      }

      setResult(data.result);
      setCompletedTasks({});
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const copyMarkdown = () => {
    if (!result) return;
    let md = `# Project Plan: ${result.projectTitle}\n\n${result.overview}\n\n`;
    result.phases.forEach((phase) => {
      md += `## ${phase.phaseName}\n*${phase.description}*\n\n`;
      phase.tasks.forEach((task, idx) => {
        const isDone = completedTasks[`${phase.phaseName}-${idx}`];
        md += `- [${isDone ? "x" : " "}] **${task.title}** (${task.estimatedHours}h, ${task.priority} Priority)\n`;
        task.subtasks?.forEach((st) => {
          md += `  - ${st}\n`;
        });
      });
      md += "\n";
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-emerald-600 mb-1">
          <CheckSquare className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Task Planner</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Task & Project Planner</h1>
        <p className="text-xs text-slate-500 mt-1">
          Deconstruct goals or ideas into actionable phased task trees with time estimates and interactive tracking.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-600 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Samples:
        </span>
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setGoal(sample.goal);
              setTimeframe(sample.timeframe);
              setTeamSize(sample.teamSize);
            }}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
          >
            {sample.goal}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Goal or Objective *
            </label>
            <textarea
              rows={4}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Build an AI-driven marketing campaign generator for real estate agents..."
              required
              className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Timeframe</label>
              <input
                type="text"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="e.g. 2 weeks"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Team Context</label>
              <input
                type="text"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g. Solo developer"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                <span>Plan Project Tasks</span>
              </>
            )}
          </button>
        </form>

        {/* Output Panel */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="my-auto text-center py-12 text-slate-400 space-y-2">
              <CheckSquare className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Your interactive project roadmap will appear here</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Describe your goal on the left and click Plan Project Tasks.
              </p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-emerald-700">Deconstructing tasks & estimates with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{result.projectTitle}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{result.overview}</p>
                </div>
                <button
                  onClick={copyMarkdown}
                  className="px-2.5 py-1 text-xs rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1 transition-colors shrink-0 ml-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Plan"}</span>
                </button>
              </div>

              {/* Phases */}
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {result.phases.map((phase, pIdx) => (
                  <div key={pIdx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">{phase.phaseName}</h4>
                      <span className="text-[10px] text-slate-500">{phase.description}</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {phase.tasks.map((task, tIdx) => {
                        const key = `${phase.phaseName}-${tIdx}`;
                        const isDone = Boolean(completedTasks[key]);

                        return (
                          <div
                            key={tIdx}
                            className={`p-2.5 rounded border transition-colors ${
                              isDone
                                ? "bg-emerald-50/60 border-emerald-200 text-slate-400 line-through"
                                : "bg-white border-slate-200 text-slate-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => toggleTask(key)}
                                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-xs">{task.title}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                                      {task.estimatedHours || 2}h
                                    </span>
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                        task.priority === "High"
                                          ? "bg-red-100 text-red-700"
                                          : task.priority === "Medium"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {task.priority}
                                    </span>
                                  </div>
                                </div>

                                {task.subtasks && task.subtasks.length > 0 && (
                                  <ul className="mt-1.5 space-y-0.5 pl-2 text-[11px] text-slate-600 border-l-2 border-slate-200">
                                    {task.subtasks.map((st, sIdx) => (
                                      <li key={sIdx}>• {st}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
