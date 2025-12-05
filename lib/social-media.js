import { getDb } from "./mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "social_media_connections";

/**
 * Store a social media connection for a user
 */
export async function saveSocialConnection(userId, platform, connectionData) {
  const db = await getDb();
  const now = new Date();

  const connection = {
    userId,
    platform, // 'youtube', 'twitter', 'linkedin', etc.
    accessToken: connectionData.accessToken,
    refreshToken: connectionData.refreshToken,
    expiresAt: connectionData.expiresAt,
    scope: connectionData.scope,
    channelId: connectionData.channelId, // Platform-specific ID
    channelTitle: connectionData.channelTitle,
    metadata: connectionData.metadata || {},
    createdAt: now,
    updatedAt: now,
  };

  // Upsert: update if exists, insert if not
  await db.collection(COLLECTION).updateOne(
    { userId, platform },
    { $set: connection },
    { upsert: true }
  );

  return connection;
}

/**
 * Get a social media connection for a user and platform
 */
export async function getSocialConnection(userId, platform) {
  const db = await getDb();
  return await db.collection(COLLECTION).findOne({ userId, platform });
}

/**
 * Get all social media connections for a user
 */
export async function getAllSocialConnections(userId) {
  const db = await getDb();
  return await db.collection(COLLECTION).find({ userId }).toArray();
}

/**
 * Delete a social media connection
 */
export async function deleteSocialConnection(userId, platform) {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ userId, platform });
}

/**
 * Update access token (for token refresh)
 */
export async function updateAccessToken(userId, platform, accessToken, expiresAt) {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId, platform },
    {
      $set: {
        accessToken,
        expiresAt,
        updatedAt: new Date(),
      },
    }
  );
}

/**
 * Track a social media post for an episode
 */
export async function trackSocialPost(episodeId, platform, postData) {
  const db = await getDb();
  const now = new Date();

  const post = {
    episodeId,
    platform,
    postId: postData.postId, // Platform-specific post/video ID
    postUrl: postData.postUrl,
    status: postData.status || "published", // 'published', 'failed', 'scheduled'
    metadata: postData.metadata || {},
    publishedAt: now,
    createdAt: now,
  };

  const result = await db.collection("social_media_posts").insertOne(post);
  return { ...post, _id: result.insertedId };
}

/**
 * Get all social posts for an episode
 */
export async function getEpisodeSocialPosts(episodeId) {
  const db = await getDb();
  return await db.collection("social_media_posts").find({ episodeId }).toArray();
}

/**
 * Check if episode has been published to a platform
 */
export async function hasPublishedToPlatform(episodeId, platform) {
  const db = await getDb();
  const post = await db
    .collection("social_media_posts")
    .findOne({ episodeId, platform, status: "published" });
  return !!post;
}
