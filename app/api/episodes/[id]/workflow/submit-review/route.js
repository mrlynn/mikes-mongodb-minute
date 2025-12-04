import { NextResponse } from "next/server";
import { submitForReview } from "@/lib/episodes";
import { getSession } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = { email: session.email, name: session.email };

    const episode = await submitForReview(id, user);

    return NextResponse.json({
      success: true,
      episode,
    });
  } catch (error) {
    console.error("Error submitting episode for review:", error);
    return NextResponse.json(
      { error: "Failed to submit episode for review" },
      { status: 500 }
    );
  }
}
