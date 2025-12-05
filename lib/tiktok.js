import { getSocialConnection, updateAccessToken } from "./social-media";

/**
 * TikTok API Integration
 *
 * TikTok Content Posting API Documentation:
 * https://developers.tiktok.com/doc/content-posting-api-get-started
 */

/**
 * Generate TikTok OAuth URL for user authorization
 */
export function getTikTokAuthUrl() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;

  if (!clientKey || !redirectUri) {
    throw new Error("TikTok credentials not configured");
  }

  const csrfState = Math.random().toString(36).substring(2);

  const scopes = [
    "user.info.basic",
    "video.upload",
    "video.publish",
  ].join(",");

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: scopes,
    response_type: "code",
    redirect_uri: redirectUri,
    state: csrfState,
  });

  return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function getTikTokTokens(code) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;

  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Failed to get TikTok tokens");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
    scope: data.scope,
    openId: data.open_id,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshTikTokToken(refreshToken) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;

  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_key: clientKey,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Failed to refresh TikTok token");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

/**
 * Get valid access token for user (auto-refresh if needed)
 */
export async function getTikTokAccessToken(userId) {
  const connection = await getSocialConnection(userId, "tiktok");

  if (!connection) {
    throw new Error("TikTok not connected");
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  const expiresAt = new Date(connection.expiresAt);
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  if (expiresAt <= fiveMinutesFromNow) {
    // Refresh the token
    const tokens = await refreshTikTokToken(connection.refreshToken);

    // Update in database
    await updateAccessToken(
      userId,
      "tiktok",
      tokens.accessToken,
      tokens.expiresAt
    );

    return tokens.accessToken;
  }

  return connection.accessToken;
}

/**
 * Get TikTok user info
 */
export async function getTikTokUserInfo(accessToken) {
  const response = await fetch("https://open.tiktokapis.com/v2/user/info/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Failed to get TikTok user info");
  }

  return {
    openId: data.data.user.open_id,
    displayName: data.data.user.display_name,
    avatarUrl: data.data.user.avatar_url,
    username: data.data.user.username,
  };
}

/**
 * Initialize video upload to TikTok
 * Step 1: Create upload session
 */
async function initializeTikTokUpload(accessToken, videoData) {
  const { videoSize, title } = videoData;

  const response = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_info: {
        title: title,
        privacy_level: videoData.privacyLevel || "SELF_ONLY",
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: "FILE_UPLOAD",
        video_size: videoSize,
        chunk_size: videoSize, // Upload in single chunk
        total_chunk_count: 1,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Failed to initialize TikTok upload");
  }

  return {
    publishId: data.data.publish_id,
    uploadUrl: data.data.upload_url,
  };
}

/**
 * Upload video file to TikTok
 * Step 2: Upload the actual video file
 */
async function uploadVideoToTikTok(uploadUrl, videoBuffer) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": videoBuffer.length.toString(),
    },
    body: videoBuffer,
  });

  if (!response.ok) {
    throw new Error("Failed to upload video to TikTok");
  }

  return true;
}

/**
 * Check upload status
 */
async function checkTikTokUploadStatus(accessToken, publishId) {
  const response = await fetch(
    `https://open.tiktokapis.com/v2/post/publish/status/${publishId}/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Failed to check upload status");
  }

  return {
    status: data.data.status,
    failReason: data.data.fail_reason,
  };
}

/**
 * Upload video to TikTok
 * Main function that orchestrates the upload process
 */
export async function uploadTikTokVideo(userId, videoData) {
  const {
    title,
    videoBuffer,
    privacyLevel = "SELF_ONLY", // Options: PUBLIC_TO_EVERYONE, MUTUAL_FOLLOW_FRIENDS, SELF_ONLY
  } = videoData;

  // Get valid access token
  const accessToken = await getTikTokAccessToken(userId);

  // Step 1: Initialize upload
  const { publishId, uploadUrl } = await initializeTikTokUpload(accessToken, {
    title,
    videoSize: videoBuffer.length,
    privacyLevel,
  });

  // Step 2: Upload video file
  await uploadVideoToTikTok(uploadUrl, videoBuffer);

  // Step 3: Check upload status (poll for completion)
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

    const status = await checkTikTokUploadStatus(accessToken, publishId);

    if (status.status === "PUBLISH_COMPLETE") {
      return {
        publishId,
        status: "published",
        videoUrl: `https://www.tiktok.com/@me/video/${publishId}`, // Approximate URL
      };
    } else if (status.status === "FAILED") {
      throw new Error(`Upload failed: ${status.failReason}`);
    }

    attempts++;
  }

  // If we get here, it's still processing
  return {
    publishId,
    status: "processing",
    videoUrl: null,
  };
}

/**
 * Revoke TikTok access (disconnect)
 */
export async function revokeTikTokAccess(userId) {
  const connection = await getSocialConnection(userId, "tiktok");

  if (!connection) {
    return true; // Already disconnected
  }

  try {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;

    await fetch("https://open.tiktokapis.com/v2/oauth/revoke/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: clientKey,
        token: connection.accessToken,
      }),
    });
  } catch (error) {
    console.error("Failed to revoke TikTok token:", error);
    // Continue anyway to delete from database
  }

  return true;
}
