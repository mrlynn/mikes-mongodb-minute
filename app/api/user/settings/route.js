import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserSettings, updateUserSettings } from "@/lib/users";

export const runtime = "nodejs";

async function getUserFromSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = jwt.verify(sessionCookie.value, process.env.JWT_SECRET, {
      clockTolerance: 60,
    });
    return decoded.email;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function GET() {
  try {
    const userEmail = await getUserFromSession();

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getUserSettings(userEmail);

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const userEmail = await getUserFromSession();

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { socialHandles, openaiApiKey } = await req.json();

    // Validate social handles structure
    if (socialHandles && typeof socialHandles !== "object") {
      return NextResponse.json(
        { error: "Invalid social handles format" },
        { status: 400 }
      );
    }

    // Update settings
    await updateUserSettings(userEmail, {
      socialHandles: socialHandles || {
        youtube: "",
        tiktok: "",
        linkedin: "",
        instagram: "",
        x: "",
      },
      openaiApiKey: openaiApiKey || "",
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
