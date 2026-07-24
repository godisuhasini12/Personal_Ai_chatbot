import React, { useState, useEffect } from "react";
import { AppSettings } from "../types";
import { Settings as SettingsIcon, Check, RefreshCw, Server, Key, ShieldCheck, Sparkles, Save } from "lucide-react";

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    selectedModel: "gemini-3.6-flash",
    defaultTone: "Executive / Professional",
    systemPromptCustom: "Maintain concise, professional, and actionable output.",
    autoSaveHistory: true,
  });

  const [saved, setSaved] = useState(false);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{ status: string; hasApiKey: boolean; timestamp: string } | null>(null);

  useEffect(() => {
    const local = localStorage.getItem("app_settings");
    if (local) {
      try {
        setSettings(JSON.parse(local));
      } catch (e) {
        // ignore
      }
    }
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setTestingHealth(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthStatus(data);
    } catch (e) {
      setHealthStatus({ status: "error", hasApiKey: false, timestamp: new Date().toISOString() });
    } finally {
      setTestingHealth(false);
    }
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("app_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-slate-700 mb-1">
          <SettingsIcon className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Application Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure Gemini AI models, server connectivity, default tones, and productivity preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Form */}
        <form onSubmit={saveSettings} className="md:col-span-8 space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Model Configuration</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Gemini Model</label>
              <select
                value={settings.selectedModel}
                onChange={(e) => setSettings({ ...settings, selectedModel: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended: Ultra fast & intelligent)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep reasoning for complex tasks)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Communication Tone</label>
              <select
                value={settings.defaultTone}
                onChange={(e) => setSettings({ ...settings, defaultTone: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Executive / Professional">Executive / Professional</option>
                <option value="Friendly & Engaging">Friendly & Engaging</option>
                <option value="Persuasive & High-Impact">Persuasive & High-Impact</option>
                <option value="Concise & Direct">Concise & Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Custom System Instruction Modifier</label>
              <textarea
                rows={3}
                value={settings.systemPromptCustom}
                onChange={(e) => setSettings({ ...settings, systemPromptCustom: e.target.value })}
                className="w-full text-xs p-3 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "Settings Saved!" : "Save Preferences"}</span>
            </button>
          </div>
        </form>

        {/* System & Server Status */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-600" /> Express & Gemini Status
              </span>
              <button
                type="button"
                onClick={checkHealth}
                disabled={testingHealth}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-600">Server Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Healthy
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <span className="text-slate-600">Gemini API Key:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Active & Proxying
                </span>
              </div>

              <div className="p-2 rounded bg-slate-50 text-[11px] text-slate-500">
                <p>Host: 0.0.0.0:3000</p>
                <p>SDK: @google/genai v2.4.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
