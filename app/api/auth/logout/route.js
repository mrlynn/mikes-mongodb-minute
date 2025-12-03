import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in logout:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
