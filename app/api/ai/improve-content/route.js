import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserSettings } from "@/lib/users";

export const runtime = "nodejs";

const IMPROVEMENT_PROMPTS = {
  "polish-hook": {
    system: "You are a content expert specializing in creating attention-grabbing hooks for educational videos. Your hooks are provocative, surprising, and stop the scroll. Avoid starting sentences with 'By...' - use direct, active language instead.",
    user: (content) => `Improve this hook to make it more engaging and attention-grabbing. Keep it concise (1-2 sentences, 10-25 words). Make it provocative or surprising. Avoid starting sentences with 'By...' - use direct, active language:\n\n"${content.hook}"\n\nReturn only the improved hook text, nothing else.`,
    field: "hook",
  },
  "expand-tip": {
    system: "You are a MongoDB developer advocate creating detailed, actionable educational content. Your tips are specific, practical, and include concrete examples. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice and direct statements instead.",
    user: (content) => `Expand and improve this tip section. Add more detail, examples, and make it more actionable. Target 75-125 words. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice:\n\n"${content.tip}"\n\nReturn only the improved tip text, nothing else.`,
    field: "tip",
  },
  "improve-title": {
    system: "You are an expert at creating catchy, SEO-friendly titles for educational content. Your titles are clear, compelling, and include relevant keywords.",
    user: (content) => `Improve this episode title to be more catchy and SEO-friendly. Keep it 5-10 words:\n\n"${content.title}"\n\nCategory: ${content.category}\nDifficulty: ${content.difficulty}\n\nReturn only the improved title, nothing else.`,
    field: "title",
  },
  "strengthen-cta": {
    system: "You are an expert at creating compelling calls-to-action that drive engagement. Your CTAs are clear, action-oriented, and create urgency. Use direct, active language. Avoid starting sentences with 'By...'.",
    user: (content) => `Strengthen this CTA to be more compelling and engaging. Keep it 1-2 sentences, 20-35 words. Use direct, active language. Avoid starting sentences with 'By...':\n\n"${content.cta}"\n\nReturn only the improved CTA text, nothing else.`,
    field: "cta",
  },
  "add-context": {
    system: "You are a technical writer specializing in setting up problems and context for educational content. Your context sections clearly explain why something matters. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice instead.",
    user: (content) => `Enhance this problem/context section with more detail and context. Target 30-50 words. Write in a direct, conversational style. Avoid starting sentences with 'By...':\n\n"${content.problem}"\n\nReturn only the improved problem/context text, nothing else.`,
    field: "problem",
  },
  "enhance-quick-win": {
    system: "You are an expert at demonstrating value and impact. Your quick wins include specific metrics, benefits, and quantifiable results. Use direct, active language. Avoid starting sentences with 'By...'.",
    user: (content) => `Enhance this quick win section to be more impactful. Add metrics or quantifiable benefits if possible. Target 20-35 words. Use direct, active language. Avoid starting sentences with 'By...':\n\n"${content.quickWin}"\n\nReturn only the improved quick win text, nothing else.`,
    field: "quickWin",
  },
};

export async function POST(req) {
  try {
    const { improvementType, currentContent } = await req.json();

    if (!improvementType || !currentContent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const promptConfig = IMPROVEMENT_PROMPTS[improvementType];
    if (!promptConfig) {
      return NextResponse.json(
        { error: "Invalid improvement type" },
        { status: 400 }
      );
    }

    // Get API key (same logic as generate-episode)
    let openaiApiKey;
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session");

      if (sessionCookie) {
        const decoded = jwt.verify(sessionCookie.value, process.env.JWT_SECRET, {
          clockTolerance: 60,
        });
        const userEmail = decoded.email;
        const userSettings = await getUserSettings(userEmail);
        openaiApiKey = userSettings.openaiApiKey;
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }

    if (!openaiApiKey) {
      openaiApiKey = process.env.OPENAI_API_KEY;
    }

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: promptConfig.system },
          { role: "user", content: promptConfig.user(currentContent) },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to improve content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const improvedContent = data.choices[0].message.content.trim();

    return NextResponse.json({
      success: true,
      field: promptConfig.field,
      improvedContent,
    });
  } catch (error) {
    console.error("Error improving content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

