import { NextResponse } from "next/server";
import { listEpisodes, createEpisode } from "@/lib/episodes";

export async function GET() {
  const episodes = await listEpisodes({ publishedOnly: false });
  return NextResponse.json(episodes);
}

export async function POST(req) {
  const body = await req.json();
  const episode = await createEpisode(body);
  return NextResponse.json(episode, { status: 201 });
}
