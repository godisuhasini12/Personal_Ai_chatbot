import React, { useState } from "react";
import { GrammarRewriterResult } from "../types";
import { Type, Sparkles, Copy, Check, RefreshCw, AlertCircle, ArrowRightLeft } from "lucide-react";

const SAMPLES = [
  {
    tone: "Executive / Professional",
    text: `i think we should maybe change how the backend handles requests because right now when too many people log in at once the server gets super slow and sometimes crashes and clients get mad.`,
  },
  {
    tone: "Concise & Direct",
    text: `I am writing to inform you that following our recent audit, we noticed several discrepancies in the inventory records that were submitted by the regional branch offices last Tuesday.`,
  },
  {
    tone: "Academic & Scholarly",
    text: `AI tools help developers write code faster because they suggest snippets and fix bugs automatically based on trained datasets.`,
  },
];

export const GrammarRewriter: React.FC = () => {
  const [text, setText] = useState("");
  const [targetTone, setTargetTone] = useState("Executive / Professional");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarRewriterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/grammar/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetTone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to rewrite text.");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-teal-600 mb-1">
          <Type className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Grammar Rewriter</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Grammar & Tone Rewriter</h1>
        <p className="text-xs text-slate-500 mt-1">
          Polish prose, adjust formality, fix grammatical errors, and rephrase across executive styles.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-600 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Samples:
        </span>
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setText(sample.text);
              setTargetTone(sample.tone);
            }}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
          >
            {sample.tone}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form onSubmit={handleRewrite} className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Style / Tone *</label>
            <select
              value={targetTone}
              onChange={(e) => setTargetTone(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="Executive / Professional">Executive / Professional</option>
              <option value="Concise & Direct">Concise & Direct</option>
              <option value="Academic & Scholarly">Academic & Scholarly</option>
              <option value="Friendly & Casual">Friendly & Casual</option>
              <option value="Creative & Engaging">Creative & Engaging</option>
              <option value="Fix Grammar & Typos Only">Fix Grammar & Typos Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Original Text *
            </label>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw text or draft here..."
              required
              className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Polishing Prose...</span>
              </>
            ) : (
              <>
                <Type className="w-4 h-4" />
                <span>Rewrite & Fix Grammar</span>
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
              <Type className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Polished text will appear here</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Paste text on the left, select a target tone, and click Rewrite.
              </p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-teal-700">Refining style & grammar with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" /> Polished Result ({targetTone})
                </span>
                <button
                  onClick={() => copyResult(result.rewrittenText)}
                  className="px-2.5 py-1 text-xs rounded bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>
              </div>

              {/* Main Rewritten Box */}
              <div className="p-4 bg-teal-50/40 rounded-md border border-teal-200 text-teal-950 font-medium leading-relaxed text-sm">
                {result.rewrittenText}
              </div>

              {/* Improvements Made */}
              {result.improvementsMade && result.improvementsMade.length > 0 && (
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="font-bold text-slate-800 block">Key Improvements Made:</span>
                  <ul className="space-y-1 text-slate-700">
                    {result.improvementsMade.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Alternative Punchier Version */}
              {result.alternativeVersion && (
                <div className="space-y-1 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Alternative Short Version:</span>
                    <button
                      type="button"
                      onClick={() => copyResult(result.alternativeVersion || "")}
                      className="text-[10px] text-teal-700 hover:underline font-semibold"
                    >
                      Copy Alternative
                    </button>
                  </div>
                  <p className="text-slate-700 italic">{result.alternativeVersion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
