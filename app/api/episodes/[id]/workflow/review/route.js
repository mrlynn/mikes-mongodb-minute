import { NextResponse } from "next/server";
import { reviewEpisode, getEpisodeById } from "@/lib/episodes";
import { getSession } from "@/lib/auth";
import { sendReviewCompletedNotification } from "@/lib/email";

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

    // Get episode before review to get submitter info
    const episodeBefore = await getEpisodeById(id);
    const submitter = episodeBefore?.workflow?.submittedForReview;

    const user = { email: session.email, name: session.email };
    const episode = await reviewEpisode(id, user, decision, notes || "");

    // Send email notification to the submitter
    if (submitter && submitter.email && submitter.email !== user.email) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`;
        await sendReviewCompletedNotification(episode, user, submitter, decision, notes || "", baseUrl);
        console.log(`✅ Review completed notification sent to ${submitter.email}`);
      } catch (emailError) {
        console.error("Error sending review completed notification:", emailError);
        // Don't fail the request if email fails
      }
    }

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
