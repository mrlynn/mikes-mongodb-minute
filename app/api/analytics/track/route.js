import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { eventType, data, timestamp, url } = await req.json();

    if (!eventType) {
      return NextResponse.json(
        { error: "Missing eventType" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const analyticsCollection = db.collection("analytics");

    await analyticsCollection.insertOne({
      eventType,
      data,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      url,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

