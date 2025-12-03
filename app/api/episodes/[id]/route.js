import { NextResponse } from "next/server";
import { getEpisodeById, updateEpisode, deleteEpisode } from "@/lib/episodes";

export async function GET(_req, { params }) {
  const resolvedParams = await params;
  const episode = await getEpisodeById(resolvedParams.id);
  return episode
    ? NextResponse.json(episode)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req, { params }) {
  const resolvedParams = await params;
  const body = await req.json();
  const updated = await updateEpisode(resolvedParams.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  const resolvedParams = await params;
  await deleteEpisode(resolvedParams.id);
  return NextResponse.json({ ok: true });
}