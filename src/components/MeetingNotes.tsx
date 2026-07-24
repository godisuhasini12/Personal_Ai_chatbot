import React, { useState } from "react";
import { MeetingNotesResult } from "../types";
import { Users, Sparkles, Copy, Check, Download, RefreshCw, AlertCircle } from "lucide-react";

const SAMPLES = [
  {
    title: "Q3 Engineering Architecture Review",
    date: "July 24, 2026",
    transcript: `Attendees: Alex (Tech Lead), Maya (Backend Eng), Liam (DevOps Lead), Sophia (Product Manager)

Alex: Okay everyone, today we need to decide on our migration strategy from standard REST to gRPC for microservices.
Maya: I benchmarked gRPC last week. Payload sizes dropped by 42% and latency went down from 110ms to 28ms for internal calls.
Liam: DevOps is ready, but we need automated protobuf code generation in CI/CD pipelines before approving production deployment.
Sophia: What's the impact on the client mobile team?
Alex: Zero breaking changes if we keep HTTP REST proxy endpoints at the edge for mobile clients.
Sophia: Perfect. Let's set a deadline of August 10th for Phase 1.
Liam: I'll own setting up GitHub Actions workflow for Protobuf compilation by next Wednesday.
Maya: I'll write the gRPC service definition files for user-auth and payment services by Friday.
Alex: Great. I'll document the API schema guidelines on Notion.`,
  },
];

export const MeetingNotes: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [transcript, setTranscript] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingNotesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/meeting-notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingTitle: title,
          date,
          transcript,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate meeting notes.");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyNotes = () => {
    if (!result) return;
    let formatted = `# Meeting Notes: ${result.title}\n\n## Executive Summary\n${result.executiveSummary}\n\n## Key Decisions\n${result.keyDecisions.map((d) => `- ${d}`).join("\n")}\n\n## Action Items\n`;
    result.actionItems.forEach((item) => {
      formatted += `- [ ] **${item.task}** (Assignee: ${item.assignee || "Unassigned"}, Priority: ${item.priority}, Deadline: ${item.deadline || "TBD"})\n`;
    });
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-purple-600 mb-1">
          <Users className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Meeting Notes</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Meeting Notes Generator</h1>
        <p className="text-xs text-slate-500 mt-1">
          Convert raw transcripts, bullet points, or discussion logs into structured executive meeting notes.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-600 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Samples:
        </span>
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setTitle(sample.title);
              setDate(sample.date);
              setTranscript(sample.transcript);
            }}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
          >
            {sample.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Architecture Review"
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. July 24, 2026"
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Raw Transcript / Notes Input *
            </label>
            <textarea
              rows={9}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste raw conversation, bullet points, or transcript here..."
              required
              className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !transcript.trim()}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Structuring Notes...</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Generate Meeting Summary</span>
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
              <Users className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Structured meeting notes will appear here</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Paste transcript on the left and click Generate.
              </p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-purple-700">Synthesizing transcript & action items with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{result.title}</h3>
                </div>
                <button
                  onClick={copyNotes}
                  className="px-2.5 py-1 text-xs rounded bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Markdown!" : "Copy Notes"}</span>
                </button>
              </div>

              {/* Executive Summary */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Executive Summary:</span>
                <p className="text-slate-700 leading-relaxed">{result.executiveSummary}</p>
              </div>

              {/* Decisions */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Key Decisions Agreed:</span>
                <ul className="space-y-1">
                  {result.keyDecisions.map((dec, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 rounded bg-purple-50/40 border border-purple-100 text-purple-900 font-medium">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span>{dec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items Table */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Action Items & Assignments:</span>
                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Task</th>
                        <th className="p-2">Assignee</th>
                        <th className="p-2">Priority</th>
                        <th className="p-2">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.actionItems.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-medium text-slate-800">{item.task}</td>
                          <td className="p-2 text-slate-600">{item.assignee || "Unassigned"}</td>
                          <td className="p-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : item.priority === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="p-2 text-slate-600">{item.deadline || "TBD"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
