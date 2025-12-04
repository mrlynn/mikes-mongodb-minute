import { getDb } from "./mongodb";

const COLLECTION = "users";

// Helper to serialize MongoDB documents for client components
function serializeUser(user) {
  if (!user) return null;
  return {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    // Don't send API key to client in serialized form for security
    openaiApiKey: undefined,
  };
}

export async function getUserByEmail(email) {
  const db = await getDb();
  const user = await db.collection(COLLECTION).findOne({ email: email.toLowerCase() });
  return user; // Return raw user with API key for server-side use
}

export async function getUserByEmailSafe(email) {
  const user = await getUserByEmail(email);
  return serializeUser(user); // Return serialized user without API key
}

export async function createUser(email, settings = {}) {
  const db = await getDb();
  const now = new Date();

  const doc = {
    email: email.toLowerCase(),
    settings: {
      socialHandles: settings.socialHandles || {
        youtube: "",
        tiktok: "",
        linkedin: "",
        instagram: "",
        x: "",
      },
      openaiApiKey: settings.openaiApiKey || "",
    },
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateUserSettings(email, settings) {
  const db = await getDb();
  const now = new Date();

  const update = {
    $set: {
      "settings.socialHandles": settings.socialHandles,
      "settings.openaiApiKey": settings.openaiApiKey,
      updatedAt: now,
    },
  };

  const result = await db.collection(COLLECTION).updateOne(
    { email: email.toLowerCase() },
    update,
    { upsert: true } // Create if doesn't exist
  );

  return result;
}

export async function getUserSettings(email) {
  const user = await getUserByEmail(email);
  if (!user) {
    return {
      socialHandles: {
        youtube: "",
        tiktok: "",
        linkedin: "",
        instagram: "",
        x: "",
      },
      openaiApiKey: "",
    };
  }
  return user.settings || {
    socialHandles: {
      youtube: "",
      tiktok: "",
      linkedin: "",
      instagram: "",
      x: "",
    },
    openaiApiKey: "",
  };
}
