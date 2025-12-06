import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

const COLLECTION = "episodes";

// Helper to serialize MongoDB documents for client components
function serializeEpisode(episode) {
  if (!episode) return null;
  const serialized = {
    ...episode,
    _id: episode._id.toString(),
    createdAt: episode.createdAt?.toISOString?.() || episode.createdAt,
    updatedAt: episode.updatedAt?.toISOString?.() || episode.updatedAt,
  };

  // Serialize thumbnail dates if present
  if (episode.thumbnail) {
    serialized.thumbnail = {
      ...episode.thumbnail,
      generatedAt: episode.thumbnail.generatedAt?.toISOString?.() || episode.thumbnail.generatedAt,
      lastUpdatedAt: episode.thumbnail.lastUpdatedAt?.toISOString?.() || episode.thumbnail.lastUpdatedAt,
    };
  }

  return serialized;
}

export async function listEpisodes({ publishedOnly = false, page = 1, limit = null } = {}) {
  const db = await getDb();
  const filter = publishedOnly ? { status: "published" } : {};

  // If no limit, return all episodes (backward compatible)
  if (!limit) {
    const episodes = await db.collection(COLLECTION).find(filter).sort({ episodeNumber: 1 }).toArray();
    console.log(`📊 listEpisodes: Found ${episodes.length} episodes with filter:`, filter);
    return episodes.map(serializeEpisode);
  }

  // With pagination
  const skip = (page - 1) * limit;
  const [episodes, total] = await Promise.all([
    db.collection(COLLECTION)
      .find(filter)
      .sort({ episodeNumber: -1 }) // Most recent first for pagination
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTION).countDocuments(filter),
  ]);

  return {
    episodes: episodes.map(serializeEpisode),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getEpisodeById(id) {
  const db = await getDb();
  const episode = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return serializeEpisode(episode);
}

export async function getEpisodeBySlug(slug) {
  const db = await getDb();
  const episode = await db.collection(COLLECTION).findOne({ slug });
  return serializeEpisode(episode);
}

export async function createEpisode(data) {
  const db = await getDb();
  const now = new Date();

  const slug = data.slug || slugify(data.title || "");
  const doc = {
    ...data,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  return serializeEpisode({ ...doc, _id: result.insertedId });
}

export async function updateEpisode(id, data) {
  const db = await getDb();
  const now = new Date();
  const update = { $set: { ...data, updatedAt: now } };

  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, update);
  return getEpisodeById(id);
}

export async function deleteEpisode(id) {
  const db = await getDb();
  return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Workflow helper functions
export async function submitForReview(episodeId, user) {
  const db = await getDb();
  const now = new Date();

  const workflowUpdate = {
    "workflow.currentStage": "tech-review",
    "workflow.submittedForReview": {
      email: user.email,
      name: user.name || user.email,
      timestamp: now,
    },
    updatedAt: now,
  };

  const historyEntry = {
    action: "submitted-for-review",
    stage: "tech-review",
    user: { email: user.email, name: user.name || user.email },
    timestamp: now,
    notes: "",
  };

  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(episodeId) },
    {
      $set: workflowUpdate,
      $push: { "workflow.history": historyEntry },
    }
  );

  return getEpisodeById(episodeId);
}

export async function reviewEpisode(episodeId, user, decision, notes = "") {
  const db = await getDb();
  const now = new Date();

  const workflowUpdate = {
    "workflow.reviewedBy": {
      email: user.email,
      name: user.name || user.email,
      timestamp: now,
      notes,
      decision,
    },
    updatedAt: now,
  };

  // If changes requested, move back to draft
  if (decision === "changes-requested") {
    workflowUpdate["workflow.currentStage"] = "draft";
  }

  const historyEntry = {
    action: decision === "approved" ? "review-approved" : "changes-requested",
    stage: decision === "approved" ? "tech-review" : "draft",
    user: { email: user.email, name: user.name || user.email },
    timestamp: now,
    notes,
  };

  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(episodeId) },
    {
      $set: workflowUpdate,
      $push: { "workflow.history": historyEntry },
    }
  );

  return getEpisodeById(episodeId);
}

export async function approveEpisode(episodeId, user, notes = "") {
  const db = await getDb();
  const now = new Date();

  const workflowUpdate = {
    "workflow.currentStage": "approved",
    "workflow.approvedBy": {
      email: user.email,
      name: user.name || user.email,
      timestamp: now,
      notes,
    },
    updatedAt: now,
  };

  const historyEntry = {
    action: "approved",
    stage: "approved",
    user: { email: user.email, name: user.name || user.email },
    timestamp: now,
    notes,
  };

  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(episodeId) },
    {
      $set: workflowUpdate,
      $push: { "workflow.history": historyEntry },
    }
  );

  return getEpisodeById(episodeId);
}

export async function initializeWorkflow(episodeId, user) {
  const db = await getDb();
  const now = new Date();

  const workflow = {
    currentStage: "draft",
    draftedBy: {
      email: user.email,
      name: user.name || user.email,
      timestamp: now,
    },
    history: [
      {
        action: "created",
        stage: "draft",
        user: { email: user.email, name: user.name || user.email },
        timestamp: now,
        notes: "Episode created",
      },
    ],
  };

  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(episodeId) },
    {
      $set: { workflow, updatedAt: now },
    }
  );

  return getEpisodeById(episodeId);
}

/**
 * Get all MongoDB team members for notifications
 * Returns array of email addresses
 */
export async function getAllTeamEmails() {
  const db = await getDb();

  // Get all users from the users collection
  const users = await db.collection("users").find({}).toArray();

  // Return array of emails
  return users.map(user => user.email).filter(Boolean);
}
