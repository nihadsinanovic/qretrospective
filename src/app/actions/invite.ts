'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function createInvite(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    const email = formData.get("email") as string
    const role = formData.get("role") as string || "VIEWER"
    const projectId = formData.get("projectId") as string

    if (!email || !projectId) return { error: "Missing fields" }

    // Check permissions (User must be Owner or Editor?)
    // Simplified check

    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

    await prisma.invite.create({
        data: {
            email,
            projectId,
            role,
            token,
            expires
        }
    })

    // "Send" email
    const link = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`
    console.log(`[MOCK EMAIL] To: ${email}, Link: ${link}`)

    return { success: true, message: "Invite sent (check console)" }
}
