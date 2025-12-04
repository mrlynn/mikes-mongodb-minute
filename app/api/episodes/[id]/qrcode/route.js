import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getEpisodeById } from "@/lib/episodes";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const episode = await getEpisodeById(id);

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    // Get the base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const episodeUrl = `${baseUrl}/episodes/${episode.slug}`;

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(episodeUrl, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 512,
      margin: 2,
      color: {
        dark: "#001E2B",  // MongoDB dark teal
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      url: episodeUrl,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
