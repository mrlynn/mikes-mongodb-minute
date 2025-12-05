import { NextResponse } from "next/server";
import { listEpisodes, createEpisode, initializeWorkflow } from "@/lib/episodes";
import { getSession } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || null;
  const publishedOnly = searchParams.get("publishedOnly") === "true";

  const result = await listEpisodes({ publishedOnly, page, limit });
  return NextResponse.json(result);
}

export async function POST(req) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const episode = await createEpisode(body);

    // Initialize workflow tracking
    const user = { email: session.email, name: session.email };
    const episodeWithWorkflow = await initializeWorkflow(episode._id, user);

    return NextResponse.json(episodeWithWorkflow, { status: 201 });
  } catch (error) {
    console.error("Error creating episode:", error);
    return NextResponse.json(
      { error: "Failed to create episode" },
      { status: 500 }
    );
  }
}
