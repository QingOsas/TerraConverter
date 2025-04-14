import { cookies } from "next/headers"
import { getAuth } from "firebase-admin/auth"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Initialize Firebase Admin if it hasn't been initialized already
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      console.error("Firebase admin credentials not provided")
      return null
    }

    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      })
    } catch (error) {
      console.error("Firebase admin initialization error:", error)
      return null
    }
  }
  return getApps()[0]
}

// Export a function to check the session on the server
export async function auth() {
  try {
    // Initialize Firebase Admin
    const app = initializeFirebaseAdmin()
    if (!app) {
      return null
    }

    const cookieStore = cookies()
    const session = cookieStore.get("session")?.value

    if (!session) {
      return null
    }

    try {
      // Verify the session cookie
      const decodedClaims = await getAuth().verifySessionCookie(session, true)

      // If session is valid, return the user info
      return {
        id: decodedClaims.uid,
        email: decodedClaims.email,
      }
    } catch (error) {
      // Session is invalid or expired
      console.error("Session verification error:", error)
      return null
    }
  } catch (error) {
    console.error("Auth function error:", error)
    return null
  }
}
