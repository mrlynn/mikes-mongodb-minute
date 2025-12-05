import { getSocialConnection, updateAccessToken } from "./social-media";

/**
 * LinkedIn API Integration
 *
 * LinkedIn Share API Documentation:
 * https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
 * https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api
 */

/**
 * Generate LinkedIn OAuth URL for user authorization
 */
export function getLinkedInAuthUrl() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("LinkedIn credentials not configured");
  }

  const scopes = [
    "openid",
    "profile",
    "email",
    "w_member_social", // Post, comment, and react to content on LinkedIn
  ].join(" ");

  const state = Math.random().toString(36).substring(2);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state,
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function getLinkedInTokens(code) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Failed to get LinkedIn tokens");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
    scope: data.scope,
  };
}

/**
 * Get LinkedIn user profile
 */
export async function getLinkedInProfile(accessToken) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get LinkedIn profile");
  }

  return {
    sub: data.sub, // LinkedIn member ID
    name: data.name,
    email: data.email,
    picture: data.picture,
  };
}

/**
 * Get valid access token for user
 * Note: LinkedIn tokens don't have refresh tokens, they expire in 60 days
 */
export async function getLinkedInAccessToken(userId) {
  const connection = await getSocialConnection(userId, "linkedin");

  if (!connection) {
    throw new Error("LinkedIn not connected");
  }

  // Check if token is expired
  const expiresAt = new Date(connection.expiresAt);
  const now = new Date();

  if (expiresAt <= now) {
    throw new Error("LinkedIn token expired - user must reconnect");
  }

  return connection.accessToken;
}

/**
 * Register video upload with LinkedIn
 * Step 1: Initialize upload and get upload URL
 */
async function registerLinkedInVideoUpload(accessToken, personUrn, videoSize) {
  const response = await fetch("https://api.linkedin.com/v2/videos?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: personUrn,
        fileSizeBytes: videoSize,
        uploadCaptions: false,
        uploadThumbnail: false,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to register video upload");
  }

  return {
    videoUrn: data.value.video,
    uploadUrl: data.value.uploadInstructions[0].uploadUrl,
    uploadHeaders: data.value.uploadInstructions[0].headers,
  };
}

/**
 * Upload video file to LinkedIn
 * Step 2: Upload the actual video file
 */
async function uploadVideoToLinkedIn(uploadUrl, uploadHeaders, videoBuffer) {
  const headers = {};
  uploadHeaders.forEach((header) => {
    headers[header.name] = header.value;
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: videoBuffer,
  });

  if (!response.ok) {
    throw new Error("Failed to upload video to LinkedIn");
  }

  return true;
}

/**
 * Finalize video upload
 * Step 3: Mark upload as complete
 */
async function finalizeLinkedInVideoUpload(accessToken, videoUrn, uploadToken) {
  const response = await fetch(`https://api.linkedin.com/v2/videos?action=finalizeUpload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      finalizeUploadRequest: {
        video: videoUrn,
        uploadToken,
      },
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to finalize video upload");
  }

  return true;
}

/**
 * Create a post with the uploaded video
 * Step 4: Create share/post with the video
 */
async function createLinkedInPost(accessToken, personUrn, videoUrn, text) {
  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text,
          },
          shareMediaCategory: "VIDEO",
          media: [
            {
              status: "READY",
              media: videoUrn,
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create LinkedIn post");
  }

  return {
    postId: data.id,
    postUrn: `urn:li:ugcPost:${data.id}`,
  };
}

/**
 * Upload video to LinkedIn
 * Main function that orchestrates the entire upload process
 */
export async function uploadLinkedInVideo(userId, videoData) {
  const { title, description, videoBuffer } = videoData;

  // Get valid access token
  const accessToken = await getLinkedInAccessToken(userId);

  // Get user's LinkedIn profile to get person URN
  const profile = await getLinkedInProfile(accessToken);
  const personUrn = `urn:li:person:${profile.sub}`;

  // Step 1: Register upload
  const { videoUrn, uploadUrl, uploadHeaders } = await registerLinkedInVideoUpload(
    accessToken,
    personUrn,
    videoBuffer.length
  );

  // Extract upload token from headers
  const uploadToken = uploadHeaders.find((h) => h.name === "upload-token")?.value;

  // Step 2: Upload video file
  await uploadVideoToLinkedIn(uploadUrl, uploadHeaders, videoBuffer);

  // Step 3: Finalize upload
  await finalizeLinkedInVideoUpload(accessToken, videoUrn, uploadToken);

  // Wait a bit for LinkedIn to process
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Step 4: Create post with video
  const postText = `${title}\n\n${description}\n\n#MongoDB #Database #Tutorial #LearnToCode`;
  const { postId, postUrn } = await createLinkedInPost(
    accessToken,
    personUrn,
    videoUrn,
    postText
  );

  return {
    postId,
    videoUrn,
    // LinkedIn doesn't provide direct post URLs in API response
    // Users can find it in their LinkedIn feed
    postUrl: `https://www.linkedin.com/feed/`,
  };
}
