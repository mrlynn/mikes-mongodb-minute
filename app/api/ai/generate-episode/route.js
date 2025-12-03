import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, category, difficulty, additionalContext } = await req.json();

    // Validate required fields
    if (!topic || !category || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Build the prompt based on the 60-second structure
    const systemPrompt = `You are a MongoDB developer advocate creating a 60-second educational video script for "Mike's MongoDB Minute".

Your scripts follow this exact structure:
1. HOOK (0-5 seconds): A provocative question, surprising stat, or relatable pain point that stops the scroll
2. PROBLEM/CONTEXT (5-15 seconds): Why this matters - connect to real developer frustrations or goals
3. TIP/SOLUTION (15-45 seconds): The core educational content - be specific, actionable, and visual
4. QUICK WIN/PROOF (45-52 seconds): Show the result, benefit, or transformation with quantifiable impact
5. CTA + TEASE (52-60 seconds): Engagement driver + hint at related content

Style guidelines:
- Conversational but authoritative (developer-to-developer)
- Practical over theoretical - always answer "what can I DO with this?"
- Use MongoDB-specific examples and code snippets where relevant
- Include humor/personality where natural
- Keep it concise and punchy - every word counts`;

    const userPrompt = `Create a MongoDB Minute episode about: "${topic}"

Category: ${category}
Difficulty Level: ${difficulty}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Generate a complete episode following the 60-second structure. Provide:
1. A catchy title (5-10 words)
2. Hook (0-5s) - 1-2 sentences
3. Problem/Context (5-15s) - 2-3 sentences
4. Tip/Solution (15-45s) - 3-5 sentences with specific examples
5. Quick Win/Proof (45-52s) - 1-2 sentences with metrics if possible
6. CTA + Tease (52-60s) - 1-2 sentences
7. Visual Suggestion - What to show on screen

Format as JSON with these exact keys: title, hook, problem, tip, quickWin, cta, visualSuggestion`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to generate episode content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    // Return the generated episode data
    return NextResponse.json({
      success: true,
      episode: {
        ...generatedContent,
        category,
        difficulty,
        status: "draft",
      },
    });
  } catch (error) {
    console.error("Error generating episode:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
