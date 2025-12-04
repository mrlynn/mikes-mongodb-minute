import { NextResponse } from "next/server";
import { approveEpisode } from "@/lib/episodes";
import { getSession } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { notes } = await req.json();

    const user = { email: session.email, name: session.email };
    const episode = await approveEpisode(id, user, notes || "");

    return NextResponse.json({
      success: true,
      episode,
    });
  } catch (error) {
    console.error("Error approving episode:", error);
    return NextResponse.json(
      { error: "Failed to approve episode" },
      { status: 500 }
    );
  }
}
