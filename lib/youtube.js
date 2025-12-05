import { google } from "googleapis";
import { getSocialConnection, updateAccessToken } from "./social-media";

/**
 * Create OAuth2 client
 */
export function getYouTubeOAuthClient() {
  return new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/youtube/callback`
  );
}

/**
 * Generate OAuth URL for user to authorize
 */
export function getYouTubeAuthUrl() {
  const oauth2Client = getYouTubeOAuthClient();

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getYouTubeTokens(code) {
  const oauth2Client = getYouTubeOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: new Date(Date.now() + tokens.expiry_date),
    scope: tokens.scope,
  };
}

/**
 * Get YouTube client with valid token for a user
 */
export async function getYouTubeClient(userId) {
  const connection = await getSocialConnection(userId, "youtube");

  if (!connection) {
    throw new Error("YouTube not connected for this user");
  }

  const oauth2Client = getYouTubeOAuthClient();
  oauth2Client.setCredentials({
    access_token: connection.accessToken,
    refresh_token: connection.refreshToken,
  });

  // Check if token is expired and refresh if needed
  const now = new Date();
  if (connection.expiresAt && new Date(connection.expiresAt) < now) {
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update stored tokens
    await updateAccessToken(
      userId,
      "youtube",
      credentials.access_token,
      new Date(Date.now() + credentials.expiry_date)
    );

    oauth2Client.setCredentials(credentials);
  }

  return google.youtube({ version: "v3", auth: oauth2Client });
}

/**
 * Get channel info
 */
export async function getYouTubeChannelInfo(userId) {
  const youtube = await getYouTubeClient(userId);

  const response = await youtube.channels.list({
    part: ["snippet", "statistics"],
    mine: true,
  });

  if (!response.data.items || response.data.items.length === 0) {
    throw new Error("No YouTube channel found");
  }

  const channel = response.data.items[0];
  return {
    channelId: channel.id,
    channelTitle: channel.snippet.title,
    channelDescription: channel.snippet.description,
    subscriberCount: channel.statistics.subscriberCount,
    videoCount: channel.statistics.videoCount,
    thumbnailUrl: channel.snippet.thumbnails.default.url,
  };
}

/**
 * Upload video to YouTube
 * @param {string} userId - User ID
 * @param {Object} videoData - Video metadata and file
 * @param {string} videoData.title - Video title
 * @param {string} videoData.description - Video description
 * @param {string[]} videoData.tags - Video tags
 * @param {string} videoData.categoryId - YouTube category ID (default: 28 = Science & Technology)
 * @param {string} videoData.privacyStatus - 'private', 'unlisted', or 'public'
 * @param {ReadableStream|Buffer} videoData.videoStream - Video file stream or buffer
 * @param {string} videoData.mimeType - Video MIME type (e.g., 'video/mp4')
 */
export async function uploadYouTubeVideo(userId, videoData) {
  const youtube = await getYouTubeClient(userId);

  const {
    title,
    description,
    tags = [],
    categoryId = "28", // Science & Technology
    privacyStatus = "unlisted",
    videoStream,
    mimeType = "video/mp4",
  } = videoData;

  try {
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
          defaultLanguage: "en",
          defaultAudioLanguage: "en",
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        mimeType,
        body: videoStream,
      },
    });

    const video = response.data;
    return {
      videoId: video.id,
      videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails?.default?.url,
      publishedAt: video.snippet.publishedAt,
    };
  } catch (error) {
    console.error("YouTube upload error:", error);
    throw new Error(`YouTube upload failed: ${error.message}`);
  }
}

/**
 * Update video metadata
 */
export async function updateYouTubeVideo(userId, videoId, updates) {
  const youtube = await getYouTubeClient(userId);

  const response = await youtube.videos.update({
    part: ["snippet", "status"],
    requestBody: {
      id: videoId,
      snippet: updates.snippet,
      status: updates.status,
    },
  });

  return response.data;
}

/**
 * Delete video
 */
export async function deleteYouTubeVideo(userId, videoId) {
  const youtube = await getYouTubeClient(userId);
  await youtube.videos.delete({ id: videoId });
}
