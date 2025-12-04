import { NextResponse } from "next/server";
import { approveEpisode, getEpisodeById } from "@/lib/episodes";
import { getSession } from "@/lib/auth";
import { sendFinalApprovalNotification } from "@/lib/email";

export async function POST(req, { params }) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { notes } = await req.json();

    // Get episode before approval to get original submitter info
    const episodeBefore = await getEpisodeById(id);
    const submitter = episodeBefore?.workflow?.draftedBy;

    const user = { email: session.email, name: session.email };
    const episode = await approveEpisode(id, user, notes || "");

    // Send email notification to the original submitter
    if (submitter && submitter.email && submitter.email !== user.email) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`;
        await sendFinalApprovalNotification(episode, user, submitter, notes || "", baseUrl);
        console.log(`✅ Final approval notification sent to ${submitter.email}`);
      } catch (emailError) {
        console.error("Error sending final approval notification:", emailError);
        // Don't fail the request if email fails
      }
    }

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
