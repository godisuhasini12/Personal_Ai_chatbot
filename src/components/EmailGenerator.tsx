import React, { useState } from "react";
import { EmailGenerateResult } from "../types";
import { Mail, Send, Copy, Check, Download, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

const SAMPLES = [
  {
    label: "Cold Sales Outreach",
    topic: "Introducing our AI Productivity Suite to a VP of Operations",
    recipient: "Sarah Jenkins, VP Operations",
    sender: "Alex Rivera, Product Specialist",
    tone: "Persuasive",
    emailType: "Cold Outreach",
    keyPoints: "30% time saved on administrative emails, seamless integration, free 14-day trial offer",
  },
  {
    label: "Project Delay Notice",
    topic: "Informing client of a 2-day delivery shift due to extra QA testing",
    recipient: "Mark Vance, Key Client",
    sender: "David Chen, Lead Project Manager",
    tone: "Professional",
    emailType: "Project Update",
    keyPoints: "Extra QA step ensures zero downtime, revised timeline is Friday 5 PM, transparent update",
  },
  {
    label: "Post-Interview Thank You",
    topic: "Thanking hiring manager for Senior AI Engineer interview",
    recipient: "Dr. Elena Rostova",
    sender: "Jordan Lee",
    tone: "Friendly",
    emailType: "Thank You",
    keyPoints: "Loved discussing distributed system architecture, eager to contribute to Gemini agents project",
  },
];

export const EmailGenerator: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("Professional");
  const [emailType, setEmailType] = useState("General");
  const [keyPoints, setKeyPoints] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailGenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadSample = (sample: (typeof SAMPLES)[0]) => {
    setTopic(sample.topic);
    setRecipient(sample.recipient);
    setSender(sample.sender);
    setTone(sample.tone);
    setEmailType(sample.emailType);
    setKeyPoints(sample.keyPoints);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          recipient,
          sender,
          tone,
          emailType,
          keyPoints,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate email.");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!result) return;
    const fullText = `Subject: ${result.subject}\n\n${result.body}`;
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email_draft_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <Mail className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Email Assistant</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Email Generator</h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate tailored executive emails, cold reachouts, or responses in seconds.
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
            onClick={() => loadSample(sample)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium shrink-0 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Topic or Purpose *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Proposing a joint partnership meeting next Tuesday"
              required
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. John Miller"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Name</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Urgent">Urgent</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="General">General</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Thank You">Thank You</option>
                <option value="Project Update">Project Update</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Key Points / Details</label>
            <textarea
              rows={3}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="e.g. Mention 20% discount code, emphasize deadline on Friday..."
              className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Email...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Generate Email Draft</span>
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
              <Mail className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Your generated email will appear here</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Fill in the topic and options on the left, then click Generate.
              </p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-indigo-700">Composing professional email with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Generated Draft</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(`Subject: ${result.subject}\n\n${result.body}`)}
                    className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={downloadTxt}
                    className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Subject:</span>
                <p className="text-xs font-semibold text-slate-900">{result.subject}</p>
              </div>

              {/* Body */}
              <div className="p-4 bg-slate-50/50 rounded-md border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {result.body}
              </div>

              {/* Highlights & Follow-up */}
              {result.keyHighlights && result.keyHighlights.length > 0 && (
                <div className="p-3 bg-indigo-50/50 rounded-md border border-indigo-100 space-y-1.5 text-xs">
                  <span className="font-semibold text-indigo-900 block">Key Highlights:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-indigo-800 text-[11px]">
                    {result.keyHighlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {result.suggestedFollowUp && (
                    <p className="text-[11px] text-indigo-700 pt-1 font-medium">
                      💡 Suggested Follow-up: {result.suggestedFollowUp}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
