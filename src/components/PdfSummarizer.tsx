import React, { useState } from "react";
import { PdfSummarizerResult } from "../types";
import { FileSearch, Sparkles, Copy, Check, Upload, RefreshCw, AlertCircle, Send, FileText } from "lucide-react";

const SAMPLE_DOCS = [
  {
    fileName: "Q2_2026_Enterprise_AI_Strategy.txt",
    content: `EXECUTIVE SUMMARY: Q2 2026 ENTERPRISE AI ARCHITECTURE & SECURITY

1. Background & Scope:
This document outlines our enterprise transition to agentic workflows powered by Gemini 3.6 Flash and Gemini 3.1 Pro models. Across 12 business units, automated productivity agents handle customer email triage, document summarization, and meeting action item routing.

2. Financial Performance & ROI:
- Initial deployment cost: $120,000.
- Estimated labor hours saved in Q2: 14,200 hours across 450 employees.
- Net cost efficiency gain: $480,000 annually.
- Payback period: 3.1 months.

3. Security & Governance Standards:
- Zero data retention policies enabled on LLM API endpoints.
- Role-based access control (RBAC) enforced via OAuth 2.0 & Firebase Auth.
- All server calls operate over TLS 1.3 with automated key rotation.

4. Next Quarter Roadmap (Q3 2026):
- Expand PDF analysis capabilities for legal contract auditing.
- Deploy real-time voice translation agents for international sales teams.
- Integrate automated Slack/Teams notification hooks for task planners.`,
  },
];

export const PdfSummarizer: React.FC = () => {
  const [docContent, setDocContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("text/plain");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PdfSummarizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Q&A state
  const [question, setQuestion] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string }[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setMimeType(file.type || "text/plain");

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64Str = evt.target?.result as string;
        setDocContent(base64Str);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const textStr = evt.target?.result as string;
        setDocContent(textStr);
      };
      reader.readAsText(file);
    }
  };

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docContent.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pdf/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileContent: docContent,
          fileName: fileName || "Pasted Document",
          mimeType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to summarize PDF document.");
      }

      setResult(data.result);
      setQaHistory([]);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setQaLoading(true);
    const qText = question;
    setQuestion("");

    try {
      const res = await fetch("/api/pdf/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: docContent.slice(0, 10000),
          question: qText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to answer question.");
      }

      setQaHistory((prev) => [...prev, { q: qText, a: data.answer }]);
    } catch (err: any) {
      setQaHistory((prev) => [...prev, { q: qText, a: `Error: ${err.message}` }]);
    } finally {
      setQaLoading(false);
    }
  };

  const copySummary = () => {
    if (!result) return;
    let text = `Executive Summary:\n${result.executiveSummary}\n\nKey Takeaways:\n${result.keyTakeaways.map((k) => `- ${k}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-rose-600 mb-1">
          <FileSearch className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Document Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">PDF & Document Summarizer</h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload PDF files or paste long documents to extract executive summaries, key terms, and ask Q&A.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-600 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Sample Doc:
        </span>
        {SAMPLE_DOCS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setFileName(sample.fileName);
              setMimeType("text/plain");
              setDocContent(sample.content);
            }}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
          >
            {sample.fileName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form onSubmit={handleSummarize} className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          {/* File Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Upload PDF or Text File</label>
            <label className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-rose-400 bg-slate-50/50 hover:bg-rose-50/20 cursor-pointer transition-colors text-center">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Click to upload document</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Supports .pdf, .txt, .md files</span>
              <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} className="hidden" />
            </label>
            {fileName && (
              <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Selected: {fileName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or Paste Document Content Directly
            </label>
            <textarea
              rows={8}
              value={docContent.startsWith("data:") ? "[PDF Base64 File Loaded]" : docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Paste raw text or whitepaper content here..."
              className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !docContent.trim()}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Summarizing Document...</span>
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                <span>Summarize Document</span>
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
              <FileSearch className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Document summary & Q&A assistant will appear here</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Upload a file or paste content on the left and click Summarize.
              </p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-rose-700">Analyzing document structure & insights with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wider">
                  Document Overview ({result.title || fileName || "Uploaded Doc"})
                </span>
                <button
                  onClick={copySummary}
                  className="px-2.5 py-1 text-xs rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Summary"}</span>
                </button>
              </div>

              {/* Executive Summary */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Executive Summary:</span>
                <p className="text-slate-700 leading-relaxed font-medium">{result.executiveSummary}</p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Top Key Takeaways:</span>
                <ul className="space-y-1">
                  {result.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 rounded bg-rose-50/40 border border-rose-100 text-slate-800">
                      <span className="text-rose-600 font-bold">📌</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Q&A Bar */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">Ask Questions About This Document:</span>

                {qaHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1 p-2.5 rounded bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-rose-700">Q: {item.q}</p>
                    <p className="text-slate-700 leading-relaxed">A: {item.a}</p>
                  </div>
                ))}

                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask e.g. What is the financial payback period?"
                    className="flex-1 text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="submit"
                    disabled={qaLoading || !question.trim()}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-semibold text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {qaLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
