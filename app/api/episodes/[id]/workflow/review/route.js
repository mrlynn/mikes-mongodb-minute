import { NextResponse } from "next/server";
import { reviewEpisode } from "@/lib/episodes";
import { getSession } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { decision, notes } = await req.json();

    if (!decision || !["approved", "changes-requested"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision. Must be 'approved' or 'changes-requested'" },
        { status: 400 }
      );
    }

    const user = { email: session.email, name: session.email };
    const episode = await reviewEpisode(id, user, decision, notes || "");

    return NextResponse.json({
      success: true,
      episode,
    });
  } catch (error) {
    console.error("Error reviewing episode:", error);
    return NextResponse.json(
      { error: "Failed to review episode" },
      { status: 500 }
    );
  }
}
