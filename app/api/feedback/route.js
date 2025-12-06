import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserSettings } from "@/lib/users";

export const runtime = "nodejs";

// Helper to get user ID from session (optional - feedback can be anonymous)
async function getUserId() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (sessionCookie) {
      const decoded = jwt.verify(sessionCookie.value, process.env.JWT_SECRET, {
        clockTolerance: 60,
      });
      return decoded.email;
    }
  } catch (error) {
    // User not logged in - that's fine, feedback can be anonymous
  }
  return null;
}

// Generate embedding for free text feedback
async function generateEmbedding(text, openaiApiKey) {
  if (!openaiApiKey || !text || text.trim().length === 0) {
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI embedding error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { episodeId, page, type, value, text, action } = body;

    // Validate required fields
    if (!page || !type) {
      return NextResponse.json(
        { error: "Missing required fields: page and type" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["satisfaction", "freeText", "behavior"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Type-specific validation
    if (type === "satisfaction" && !value) {
      return NextResponse.json(
        { error: "Missing value for satisfaction feedback" },
        { status: 400 }
      );
    }

    if (type === "freeText" && !text) {
      return NextResponse.json(
        { error: "Missing text for freeText feedback" },
        { status: 400 }
      );
    }

    if (type === "behavior" && !action) {
      return NextResponse.json(
        { error: "Missing action for behavior feedback" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const userId = await getUserId();
    const timestamp = new Date();

    // Build feedback document
    const feedbackDoc = {
      episodeId: episodeId || null,
      page, // "home" | "episode"
      type,
      value: value || null, // "helpful" | "notHelpful" | null
      text: text || null,
      action: action || null, // For behavior type
      timestamp,
      userId,
      createdAt: timestamp,
    };

    // Generate embedding for free text
    if (type === "freeText" && text) {
      // Get OpenAI API key
      let openaiApiKey;
      try {
        if (userId) {
          const userSettings = await getUserSettings(userId);
          openaiApiKey = userSettings?.openaiApiKey;
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }

      if (!openaiApiKey) {
        openaiApiKey = process.env.OPENAI_API_KEY;
      }

      if (openaiApiKey) {
        const embedding = await generateEmbedding(text, openaiApiKey);
        if (embedding) {
          feedbackDoc.embedding = embedding;
        }
      }
    }

    // Insert into feedback collection
    await db.collection("feedback").insertOne(feedbackDoc);

    return NextResponse.json({ success: true, id: feedbackDoc._id });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const episodeId = searchParams.get("episodeId");
    const page = searchParams.get("page");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const db = await getDb();
    const filter = {};

    if (episodeId) filter.episodeId = episodeId;
    if (page) filter.page = page;
    if (type) filter.type = type;

    const feedback = await db
      .collection("feedback")
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Convert MongoDB objects to JSON
    const serialized = feedback.map((f) => ({
      ...f,
      _id: f._id.toString(),
      timestamp: f.timestamp.toISOString(),
      createdAt: f.createdAt.toISOString(),
    }));

    return NextResponse.json({ feedback: serialized });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

