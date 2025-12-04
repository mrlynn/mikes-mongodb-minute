import { NextResponse } from "next/server";
import { listEpisodes, createEpisode, initializeWorkflow } from "@/lib/episodes";
import { getSession } from "@/lib/auth";

export async function GET() {
  const episodes = await listEpisodes({ publishedOnly: false });
  return NextResponse.json(episodes);
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
