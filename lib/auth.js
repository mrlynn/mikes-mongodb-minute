import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return null;
    }

    const decoded = jwt.verify(sessionCookie.value, process.env.JWT_SECRET);

    // Verify email is from mongodb.com
    if (!decoded.email || !decoded.email.endsWith("@mongodb.com")) {
      return null;
    }

    return {
      email: decoded.email,
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return {
      authenticated: false,
      session: null,
    };
  }

  return {
    authenticated: true,
    session,
  };
}
