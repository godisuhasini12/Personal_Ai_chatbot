import React, { useState } from "react";
import { ContentCreatorResult } from "../types";
import { PenTool, Sparkles, Copy, Check, RefreshCw, AlertCircle, Share2, Lightbulb } from "lucide-react";

const SAMPLES = [
  {
    platform: "LinkedIn",
    topic: "Lessons learned from scaling our AI agent architecture to 100k daily queries",
    keyTakeaways: "Latency reduced by 60%, serverless caching, importance of structured JSON output",
    tone: "Professional & Inspiring",
    audience: "Tech Founders, CTOs, AI Engineers",
  },
  {
    platform: "Twitter/X",
    topic: "5 AI productivity prompts that saved me 10 hours this week",
    keyTakeaways: "Email summarization, meeting notes formatting, code refactoring, grammar polishing",
    tone: "Engaging & Punchy",
    audience: "Developers & Creators",
  },
  {
    platform: "Blog Post",
    topic: "The Future of Autonomous AI Agents in Enterprise Workflows",
    keyTakeaways: "Shift from simple chatbots to agentic workflows, human-in-the-loop governance",
    tone: "Educational & Analytical",
    audience: "Enterprise Decision Makers",
  },
];

export const ContentCreator: React.FC = () => {
  const [platform, setPlatform] = useState("LinkedIn");
  const [topic, setTopic] = useState("");
  const [keyTakeaways, setKeyTakeaways] = useState("");
  const [tone, setTone] = useState("Professional & Inspiring");
  const [audience, setAudience] = useState("Tech & Business Professionals");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentCreatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/content/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          topic,
          keyTakeaways,
          tone,
          audience,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create content.");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyContent = () => {
    if (!result) return;
    const fullPost = `${result.headline}\n\n${result.content}\n\n${result.hashtags?.join(" ")}`;
    navigator.clipboard.writeText(fullPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-amber-600 mb-1">
          <PenTool className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Content Creator</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Multi-Platform Content Creator</h1>
        <p className="text-xs text-slate-500 mt-1">
          Craft high-engagement posts for LinkedIn, Twitter, Instagram, blogs, and newsletters.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-600 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Samples:
        </span>
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPlatform(sample.platform);
              setTopic(sample.topic);
              setKeyTakeaways(sample.keyTakeaways);
              setTone(sample.tone);
              setAudience(sample.audience);
            }}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
          >
            {sample.platform}: {sample.topic.slice(0, 30)}...
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form onSubmit={handleCreate} className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Platform *</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="LinkedIn">LinkedIn Post</option>
              <option value="Twitter/X">Twitter/X Thread</option>
              <option value="Instagram">Instagram Caption</option>
              <option value="Blog Post">Blog Article</option>
              <option value="Newsletter">Newsletter Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topic / Main Theme *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 productivity hacks for remote software engineering teams"
              required
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Key Points / Takeaways</label>
            <textarea
              rows={3}
              value={keyTakeaways}
              onChange={(e) => setKeyTakeaways(e.target.value)}
              placeholder="e.g. Time blocking, deep work hours, automated standup notes..."
              className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tone</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Inspiring & Punchy"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Tech Leaders"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Content...</span>
              </>
            ) : (
              <>
                <PenTool className="w-4 h-4" />
                <span>Generate Post</span>
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
              <PenTool className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Generated social copy will appear here</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Fill in the options on the left and click Generate Post.
              </p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-amber-700">Writing engaging copy with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wider">
                  {platform} Copy Draft
                </span>
                <button
                  onClick={copyContent}
                  className="px-2.5 py-1 text-xs rounded bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Post"}</span>
                </button>
              </div>

              {/* Headline / Hook */}
              <div className="p-3 bg-amber-50/50 rounded-md border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
                  Hook / Headline:
                </span>
                <p className="font-bold text-slate-900 text-sm">{result.headline}</p>
              </div>

              {/* Body */}
              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {result.content}
              </div>

              {/* Hashtags */}
              {result.hashtags && result.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[11px]">
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}

              {/* Graphic Ideas */}
              {result.mediaIdeas && result.mediaIdeas.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1 text-slate-700">
                  <span className="font-bold flex items-center gap-1 text-amber-800">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Pairing Graphic / Image Suggestions:
                  </span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-600">
                    {result.mediaIdeas.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
