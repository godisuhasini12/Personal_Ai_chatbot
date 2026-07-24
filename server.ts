import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initializer for Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. Email Generator
app.post("/api/email/generate", async (req, res) => {
  try {
    const { topic, recipient, sender, tone, emailType, keyPoints, model } = req.body;
    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    const prompt = `You are an expert executive communication assistant. Generate a high-converting, professional email draft.
Details:
- Purpose/Topic: ${topic || "General business update"}
- Recipient: ${recipient || "Respected Client / Team"}
- Sender Name: ${sender || "AI User"}
- Tone: ${tone || "Professional"}
- Email Type: ${emailType || "General"}
- Key Points to Include: ${keyPoints || "N/A"}

Please return JSON with:
1. "subject": Catchy, clear subject line
2. "body": The formatted body of the email with appropriate line breaks and greeting/sign-off
3. "keyHighlights": Array of 3 key takeaways or bullet points summarized from the email
4. "suggestedFollowUp": Brief suggested follow-up timing or next step`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
            keyHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedFollowUp: { type: Type.STRING },
          },
          required: ["subject", "body"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Email generator error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate email." });
  }
});

// 2. Email Summarizer
app.post("/api/email/summarize", async (req, res) => {
  try {
    const { emailContent, model } = req.body;
    if (!emailContent) {
      return res.status(400).json({ success: false, error: "Email content is required." });
    }

    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    const prompt = `Analyze the following email or email thread and summarize it concisely:
---
${emailContent}
---

Provide a JSON object with:
1. "summary": A brief 2-3 sentence overview
2. "keyPoints": Array of main facts/arguments
3. "actionItems": Array of action items (tasks requested, deadlines, or pending replies)
4. "sentiment": One of "Positive", "Neutral", "Urgent", or "Frustrated/Critical"
5. "quickReplies": Array of 3 short template reply ideas (e.g. "Acknowledge receipt", "Request more info", "Confirm meeting")`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING },
            quickReplies: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "keyPoints", "actionItems"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Email summarizer error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to summarize email." });
  }
});

// 3. Meeting Notes Generator
app.post("/api/meeting-notes/generate", async (req, res) => {
  try {
    const { transcript, meetingTitle, date, model } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, error: "Transcript or notes input required." });
    }

    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    const prompt = `Transform the following raw meeting transcript or bullet points into executive-ready meeting notes.
Title: ${meetingTitle || "Team Sync"}
Date: ${date || "Today"}

Raw Input:
---
${transcript}
---

Return JSON:
1. "title": Meeting title
2. "executiveSummary": High-level summary of the meeting
3. "keyDecisions": Array of key decisions agreed upon
4. "actionItems": Array of objects { task: string, assignee: string, priority: "High"|"Medium"|"Low", deadline: string }
5. "openQuestions": Array of unresolved items or topics to revisit
6. "nextSteps": Array of immediate next steps`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            keyDecisions: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  assignee: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                },
                required: ["task"],
              },
            },
            openQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["executiveSummary", "keyDecisions", "actionItems"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Meeting notes error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate meeting notes." });
  }
});

// 4. Task Planner
app.post("/api/task-planner/generate", async (req, res) => {
  try {
    const { goal, timeframe, teamSize, model } = req.body;
    if (!goal) {
      return res.status(400).json({ success: false, error: "Goal or project prompt required." });
    }

    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    const prompt = `Act as a senior Agile project manager and technical lead. Break down this project goal into an actionable roadmap with clear tasks:
Goal: ${goal}
Timeframe: ${timeframe || "2 weeks"}
Team Size/Context: ${teamSize || "1 person"}

Return JSON with:
1. "projectTitle": Name of project
2. "overview": Brief execution strategy
3. "phases": Array of objects:
   - "phaseName": e.g. "Phase 1: Architecture & Setup"
   - "description": What happens in this phase
   - "tasks": Array of objects:
     - "id": string (unique e.g. "t1")
     - "title": Task name
     - "estimatedHours": number
     - "priority": "High" | "Medium" | "Low"
     - "subtasks": Array of strings`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectTitle: { type: Type.STRING },
            overview: { type: Type.STRING },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        estimatedHours: { type: Type.NUMBER },
                        priority: { type: Type.STRING },
                        subtasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["title"],
                    },
                  },
                },
                required: ["phaseName", "tasks"],
              },
            },
          },
          required: ["projectTitle", "phases"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Task planner error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate project plan." });
  }
});

// 5. Content Creator
app.post("/api/content/create", async (req, res) => {
  try {
    const { platform, topic, keyTakeaways, tone, audience, model } = req.body;
    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    const prompt = `Generate engaging digital content tailored for the ${platform || "LinkedIn"} platform.
Topic: ${topic || "AI in Productivity"}
Key Takeaways: ${keyTakeaways || "Boost output, automate routine tasks"}
Tone: ${tone || "Professional & Inspiring"}
Target Audience: ${audience || "Professionals & Tech Leaders"}

Return JSON:
1. "headline": Catchy headline / hook
2. "content": Complete main post content formatted for ${platform} with linebreaks, emojis, and call to action
3. "hashtags": Array of relevant trending hashtags
4. "mediaIdeas": Array of visual/graphic ideas to pair with this post`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            content: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            mediaIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["headline", "content"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Content creator error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to create content." });
  }
});

// 6. Grammar Rewriter
app.post("/api/grammar/rewrite", async (req, res) => {
  try {
    const { text, targetTone, model } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: "Text is required." });
    }

    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    const prompt = `Improve, polish, and fix grammar for the following text.
Target Style/Tone: ${targetTone || "Executive / Professional"}

Original Text:
---
${text}
---

Return JSON:
1. "rewrittenText": Fully improved version
2. "improvementsMade": Array of bullet points describing key fixes (grammar, word choice, clarity)
3. "toneAnalysis": Brief observation of the shift in tone
4. "alternativeVersion": A secondary shorter/punchier alternative`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rewrittenText: { type: Type.STRING },
            improvementsMade: { type: Type.ARRAY, items: { type: Type.STRING } },
            toneAnalysis: { type: Type.STRING },
            alternativeVersion: { type: Type.STRING },
          },
          required: ["rewrittenText", "improvementsMade"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Grammar rewriter error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to rewrite text." });
  }
});

// 7. PDF / Document Summarizer
app.post("/api/pdf/summarize", async (req, res) => {
  try {
    const { fileContent, mimeType, fileName, model } = req.body;
    if (!fileContent) {
      return res.status(400).json({ success: false, error: "File content or text input required." });
    }

    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    let contentsParts: any[] = [];

    // Check if base64 encoded file or raw text
    if (fileContent.startsWith("data:") || mimeType === "application/pdf") {
      const base64Data = fileContent.includes(",") ? fileContent.split(",")[1] : fileContent;
      contentsParts = [
        {
          inlineData: {
            mimeType: mimeType || "application/pdf",
            data: base64Data,
          },
        },
        {
          text: `Summarize this document (${fileName || "uploaded document"}). Provide an executive summary, top 5 key takeaways, key sections overview, and major terms/concepts.`,
        },
      ];
    } else {
      contentsParts = [
        {
          text: `Summarize the following document content (${fileName || "uploaded document"}):
---
${fileContent}
---
Provide an executive summary, top 5 key takeaways, key sections overview, and major terms/concepts.`,
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: { parts: contentsParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            sectionsBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ["heading", "summary"],
              },
            },
            keyTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["executiveSummary", "keyTakeaways"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("PDF summarizer error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to summarize PDF document." });
  }
});

// Q&A for PDF/Document
app.post("/api/pdf/ask", async (req, res) => {
  try {
    const { documentText, question, model } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, error: "Question is required." });
    }

    const ai = getGeminiClient();
    const selectedModel = model || "gemini-3.6-flash";

    const prompt = `Document context:
---
${documentText || "Standard productivity context"}
---

Question: ${question}

Provide a direct, accurate answer based on the document text. Cite key sentences or evidence if applicable.`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
    });

    res.json({ success: true, answer: response.text });
  } catch (err: any) {
    console.error("Document Q&A error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to answer question." });
  }
});

// Vite server integration in dev mode, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
