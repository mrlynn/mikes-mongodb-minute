import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserSettings } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { episodes, productAreas } = await req.json();

    if (!episodes || !productAreas) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Build analysis prompt
    const systemPrompt = `You are a MongoDB content strategist analyzing educational content coverage. Your job is to identify gaps in topic coverage across MongoDB's product platform and recommend high-value topics to create.`;

    const userPrompt = `Analyze the following MongoDB educational episodes and identify content gaps:

EXISTING EPISODES (${episodes.length} total):
${episodes.map((e, i) => `${i + 1}. [${e.category}] ${e.difficulty}: ${e.title}`).join("\n")}

MONGODB PRODUCT AREAS TO COVER:
${productAreas.map((area) => `- ${area.area}: ${area.topics.join(", ")}`).join("\n")}

Analyze and provide:
1. Overall coverage percentage (0-100%)
2. Number of product areas with good coverage (>=3 episodes)
3. Number of significant gaps identified
4. Top 10 recommended topics to create, each with:
   - Topic title
   - Category
   - Suggested difficulty level
   - Reason why it's important
   - Priority (High/Medium/Low)
5. Coverage breakdown by product area showing:
   - Area name
   - Coverage percentage
   - Missing topics from that area

Return as JSON with this structure:
{
  "coveragePercentage": number,
  "coveredAreas": number,
  "gapCount": number,
  "recommendations": [
    {
      "topic": "string",
      "category": "string",
      "suggestedDifficulty": "Beginner|Intermediate|Advanced",
      "reason": "string",
      "priority": "High|Medium|Low"
    }
  ],
  "areaCoverage": [
    {
      "area": "string",
      "coverage": number,
      "missingTopics": ["string"]
    }
  ]
}`;

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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to analyze gaps" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing gaps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

