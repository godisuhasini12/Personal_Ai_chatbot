import React, { useState } from "react";
import { EmailSummarizeResult } from "../types";
import { FileText, Sparkles, Copy, Check, RefreshCw, AlertCircle, MessageSquare } from "lucide-react";

const SAMPLE_EMAILS = [
  {
    title: "Client Contract Renewal Thread",
    text: `From: Mark Sterling <mark@acmeclient.com>
To: Support Team <support@ourcompany.com>
Subject: Re: Annual License Renewal Discussion

Hi Team,

We reviewed the proposed $45,000 annual license renewal for our 200 seats. While we love the software, our CFO wants us to explore a 10% volume discount given our economic headwinds this quarter.

If you can offer the 10% discount ($40,500 total) or bundle 20 extra premium analytics seats at no charge, we can sign the contract by this Friday. Otherwise, we'll need to schedule a call with your sales VP to discuss terms.

Please let me know as soon as possible as our existing term expires next Monday.

Best,
Mark Sterling`,
  },
  {
    title: "Product Sprint Release Delay",
    text: `From: Developer Lead <dev@company.com>
To: Product Managers <pm@company.com>
Subject: Critical Bug in v2.4 Release Candidate

Hey PM team,

During automated staging tests for v2.4 last night, we discovered a memory leak issue when processing large CSV file uploads over 100MB.

We need 24-48 hours to patch the memory allocation routine and re-run stress tests.
Consequently, we recommend pushing the public launch from Wednesday to Friday morning.

Action required from you:
1. Update marketing schedule regarding launch announcement.
2. Notify beta partners about the 2-day shift.

Sorry for the inconvenience, but we want to ensure zero platform crashes.`,
  },
];

export const EmailSummarizer: React.FC = () => {
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailSummarizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContent.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/email/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to summarize email.");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Smart Summaries</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Email Summarizer</h1>
        <p className="text-xs text-slate-500 mt-1">
          Distill long email threads into executive summaries, action items, sentiment tags, and quick replies.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-600 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Samples:
        </span>
        {SAMPLE_EMAILS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setEmailContent(sample.text)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
          >
            {sample.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form onSubmit={handleSummarize} className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paste Email Content or Thread *
            </label>
            <textarea
              rows={10}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste long email text or entire message chain here..."
              required
              className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !emailContent.trim()}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Email...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Summarize Email</span>
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
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Summary and analysis will display here</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Paste an email thread on the left and click Summarize.
              </p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-blue-700">Extracting key points & sentiment with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 text-xs">
              {/* Top Sentiment badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wider">Executive Overview</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                    result.sentiment.includes("Urgent") || result.sentiment.includes("Frustrated")
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  Sentiment: {result.sentiment}
                </span>
              </div>

              {/* Summary */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <p className="text-slate-800 leading-relaxed font-medium">{result.summary}</p>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block">Main Key Points:</span>
                <ul className="space-y-1">
                  {result.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 bg-slate-50/50 p-2 rounded border border-slate-100">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items */}
              {result.actionItems && result.actionItems.length > 0 && (
                <div className="space-y-1.5 p-3 bg-amber-50/60 rounded-md border border-amber-200/80">
                  <span className="font-bold text-amber-900 block">Pending Action Items:</span>
                  <ul className="space-y-1">
                    {result.actionItems.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-amber-900 font-medium">
                        <span className="text-amber-600 font-bold">⚡</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Replies */}
              {result.quickReplies && result.quickReplies.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Quick Reply Angles:
                  </span>
                  <div className="space-y-1.5">
                    {result.quickReplies.map((reply, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                      >
                        <span className="truncate pr-2 font-medium">{reply}</span>
                        <button
                          type="button"
                          onClick={() => copyText(reply, i)}
                          className="px-2 py-0.5 text-[10px] bg-white border border-slate-300 rounded hover:bg-slate-50 font-semibold flex items-center gap-1 shrink-0"
                        >
                          {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIndex === i ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
