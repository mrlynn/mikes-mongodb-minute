import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getDb } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const videoFile = formData.get("video");
    const transcript = formData.get("transcript");

    if (!videoFile) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "recordings");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `recording-${timestamp}.webm`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save metadata to database
    const db = await getDb();
    const now = new Date();

    const recordingDoc = {
      filename,
      filepath: `/uploads/recordings/${filename}`,
      transcript: transcript || "",
      duration: null, // Could be calculated from video metadata
      fileSize: buffer.length,
      mimeType: videoFile.type || "video/webm",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("recordings").insertOne(recordingDoc);

    return NextResponse.json({
      success: true,
      recordingId: result.insertedId.toString(),
      filepath: recordingDoc.filepath,
    });
  } catch (error) {
    console.error("Error saving recording:", error);
    return NextResponse.json(
      { error: "Failed to save recording", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const recordings = await db
      .collection("recordings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Serialize MongoDB documents
    const serialized = recordings.map((rec) => ({
      ...rec,
      _id: rec._id.toString(),
      createdAt: rec.createdAt.toISOString(),
      updatedAt: rec.updatedAt.toISOString(),
    }));

    return NextResponse.json({ recordings: serialized });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return NextResponse.json(
      { error: "Failed to fetch recordings", details: error.message },
      { status: 500 }
    );
  }
}
