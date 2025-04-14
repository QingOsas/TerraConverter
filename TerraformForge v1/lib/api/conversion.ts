import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, storage } from "@/lib/firebase/firebase"
import { getCurrentUser } from "@/lib/firebase/auth-client"
import type { CloudProvider } from "@/lib/types"

// Function to convert ARM/Bicep to Terraform
export async function convertToTerraform(
  file: File,
  cloudProvider: CloudProvider,
): Promise<{ name: string; content: string }[]> {
  try {
    // 1. Upload the file to Firebase Storage
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new Error("User not authenticated")
    }

    const userId = currentUser.uid
    const timestamp = new Date().getTime()
    const storageRef = ref(storage, `uploads/${userId}/${timestamp}_${file.name}`)

    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    // 2. Call the Firebase Function to convert the file
    const response = await fetch("/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileUrl: downloadURL,
        fileName: file.name,
        cloudProvider,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Conversion failed")
    }

    const result = await response.json()

    // 3. Log the conversion in Firestore
    await addDoc(collection(db, "conversions"), {
      userId,
      fileName: file.name,
      targetProvider: cloudProvider,
      timestamp: serverTimestamp(),
      status: "completed",
    })

    // Return the converted files
    return result.files
  } catch (error) {
    console.error("Error in conversion process:", error)
    throw error
  }
}
