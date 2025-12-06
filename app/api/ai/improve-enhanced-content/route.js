import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserSettings } from "@/lib/users";

export const runtime = "nodejs";

const ENHANCED_IMPROVEMENT_PROMPTS = {
  "generate-summary": {
    system: "You are a content expert creating concise, compelling one-sentence summaries for educational videos. Your summaries are clear, engaging, and capture the essence of the content. Use direct, active language. Avoid starting sentences with 'By...'.",
    user: (content) => `Generate a concise one-sentence summary (15-25 words) for this MongoDB educational episode. Use direct, active language. Avoid starting with 'By...':

Title: ${content.title}
Category: ${content.category}
Difficulty: ${content.difficulty}
Hook: ${content.hook}
Tip: ${content.tip}

Return only the summary sentence, nothing else.`,
    field: "summary",
  },
  "improve-summary": {
    system: "You are a content expert improving summaries to be more compelling and engaging while staying concise. Use direct, active language. Avoid starting sentences with 'By...'.",
    user: (content) => `Improve this summary to be more compelling and engaging. Keep it to one sentence (15-25 words). Use direct, active language. Avoid starting with 'By...':

"${content.summary}"

Episode: ${content.title}
Category: ${content.category}

Return only the improved summary, nothing else.`,
    field: "summary",
  },
  "generate-deep-dive": {
    system: "You are a MongoDB developer advocate creating detailed technical explanations. Your deep dives are comprehensive, well-structured, and include practical examples. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice and direct statements instead.",
    user: (content) => `Generate a comprehensive deep dive explanation (300-500 words) for this MongoDB episode. Use markdown formatting with headers, lists, and code examples where appropriate. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice:

Title: ${content.title}
Category: ${content.category}
Difficulty: ${content.difficulty}
Hook: ${content.hook}
Problem: ${content.problem}
Tip: ${content.tip}
Quick Win: ${content.quickWin}
CTA: ${content.cta}

Create a detailed technical explanation that expands on the 60-second script. Include:
- Overview of the concept
- Step-by-step breakdown
- Code examples or patterns
- Best practices
- Common use cases

Return only the deep dive content in markdown format, nothing else.`,
    field: "deepDive",
  },
  "expand-deep-dive": {
    system: "You are a technical writer expanding existing content with more detail, examples, and practical guidance. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice instead.",
    user: (content) => `Expand and enhance this deep dive content. Add more detail, examples, and practical guidance. Keep the existing structure but make it more comprehensive. Write in a direct, conversational style. Avoid starting sentences with 'By...':

"${content.deepDive}"

Episode: ${content.title}
Category: ${content.category}

Return only the expanded deep dive content in markdown format, nothing else.`,
    field: "deepDive",
  },
  "generate-key-concepts": {
    system: "You are a MongoDB expert identifying key concepts, pitfalls, and best practices for educational content. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice and direct statements instead.",
    user: (content) => `Generate key concepts for this MongoDB episode. Provide (use direct, active language, avoid starting with 'By...'):
1. Pitfalls to Avoid (2-3 common mistakes, 1-2 sentences each)
2. When to Use (2-3 best scenarios, 1-2 sentences each)
3. When NOT to Use (2-3 situations to avoid, 1-2 sentences each)

Episode: ${content.title}
Category: ${content.category}
Difficulty: ${content.difficulty}
Tip: ${content.tip}

Return as JSON:
{
  "pitfalls": "Common mistake 1. Common mistake 2.",
  "whenToUse": "Best scenario 1. Best scenario 2.",
  "whenNotToUse": "Avoid when 1. Avoid when 2."
}`,
    field: "keyConcepts",
    returnsObject: true,
  },
  "improve-pitfalls": {
    system: "You are a MongoDB expert identifying common pitfalls and mistakes developers make. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice instead.",
    user: (content) => `Improve and expand this pitfalls section. Make it more specific with concrete examples. Use direct, active language. Avoid starting sentences with 'By...':

"${content.keyConcepts?.pitfalls || ""}"

Episode: ${content.title}
Category: ${content.category}
Tip: ${content.tip}

Return only the improved pitfalls text (2-3 sentences), nothing else.`,
    field: "keyConcepts",
    subField: "pitfalls",
  },
  "improve-when-to-use": {
    system: "You are a MongoDB expert identifying best scenarios and use cases for technical concepts. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice instead.",
    user: (content) => `Improve and expand this "when to use" section. Make it more specific with concrete scenarios. Use direct, active language. Avoid starting sentences with 'By...':

"${content.keyConcepts?.whenToUse || ""}"

Episode: ${content.title}
Category: ${content.category}
Tip: ${content.tip}

Return only the improved "when to use" text (2-3 sentences), nothing else.`,
    field: "keyConcepts",
    subField: "whenToUse",
  },
  "improve-when-not-to-use": {
    system: "You are a MongoDB expert identifying situations where certain approaches should be avoided. Write in a direct, conversational style. Avoid starting sentences with 'By...' - use active voice instead.",
    user: (content) => `Improve and expand this "when NOT to use" section. Make it more specific with concrete scenarios. Use direct, active language. Avoid starting sentences with 'By...':

"${content.keyConcepts?.whenNotToUse || ""}"

Episode: ${content.title}
Category: ${content.category}
Tip: ${content.tip}

Return only the improved "when NOT to use" text (2-3 sentences), nothing else.`,
    field: "keyConcepts",
    subField: "whenNotToUse",
  },
  "suggest-tags": {
    system: "You are an expert at generating relevant tags for technical content. Your tags are specific, searchable, and cover the main topics.",
    user: (content) => `Generate 5-8 relevant tags for this MongoDB episode. Tags should be:
- Specific and technical
- Searchable keywords
- Cover main topics and concepts
- Include category and difficulty level

Title: ${content.title}
Category: ${content.category}
Difficulty: ${content.difficulty}
Tip: ${content.tip}

Return only a comma-separated list of tags, nothing else.`,
    field: "tags",
    returnsArray: true,
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

    const promptConfig = ENHANCED_IMPROVEMENT_PROMPTS[improvementType];
    if (!promptConfig) {
      return NextResponse.json(
        { error: "Invalid improvement type" },
        { status: 400 }
      );
    }

    // Get API key
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
        max_tokens: promptConfig.returnsObject || promptConfig.returnsArray ? 1000 : 1500,
        ...(promptConfig.returnsObject || promptConfig.returnsArray
          ? { response_format: { type: "json_object" } }
          : {}),
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
    let improvedContent = data.choices[0].message.content.trim();

    // Handle different return types
    if (promptConfig.returnsObject) {
      try {
        const parsed = JSON.parse(improvedContent);
        return NextResponse.json({
          success: true,
          field: promptConfig.field,
          improvedContent: parsed,
        });
      } catch (e) {
        // If JSON parsing fails, try to extract from text
        improvedContent = improvedContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(improvedContent);
        return NextResponse.json({
          success: true,
          field: promptConfig.field,
          improvedContent: parsed,
        });
      }
    }

    if (promptConfig.returnsArray) {
      // Parse comma-separated tags
      const tags = improvedContent
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      return NextResponse.json({
        success: true,
        field: promptConfig.field,
        improvedContent: tags,
      });
    }

    if (promptConfig.subField) {
      // For keyConcepts sub-fields, return the object structure
      return NextResponse.json({
        success: true,
        field: promptConfig.field,
        subField: promptConfig.subField,
        improvedContent,
      });
    }

    return NextResponse.json({
      success: true,
      field: promptConfig.field,
      improvedContent,
    });
  } catch (error) {
    console.error("Error improving enhanced content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

