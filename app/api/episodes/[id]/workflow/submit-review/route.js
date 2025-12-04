import { NextResponse } from "next/server";
import { submitForReview, getAllTeamEmails } from "@/lib/episodes";
import { getSession } from "@/lib/auth";
import { sendReviewRequestNotification } from "@/lib/email";

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

    // Send email notifications to all team members
    try {
      const teamEmails = await getAllTeamEmails();
      // Filter out the submitter from notifications
      const reviewers = teamEmails.filter(email => email !== user.email);

      if (reviewers.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`;
        await sendReviewRequestNotification(episode, user, reviewers, baseUrl);
        console.log(`✅ Review request notifications sent to ${reviewers.length} team members`);
      }
    } catch (emailError) {
      console.error("Error sending review request notifications:", emailError);
      // Don't fail the request if email fails
    }

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
