'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    const name = formData.get("name") as string
    const teamName = formData.get("teamName") as string

    if (!name || !teamName) return { error: "Missing fields" }

    // Find or create team (simplistic approach: anyone can create a team)
    // Check if user has a team with this name, or create one.
    // Actually, let's look up if the user owns a team with this name

    let team = await prisma.team.findFirst({
        where: {
            name: teamName,
            ownerId: session.user.id
        }
    })

    if (!team) {
        team = await prisma.team.create({
            data: {
                name: teamName,
                ownerId: session.user.id
            }
        })
    }

    const project = await prisma.project.create({
        data: {
            name,
            teamId: team.id,
            members: {
                create: {
                    userId: session.user.id,
                    role: "OWNER"
                }
            }
        }
    })

    revalidatePath("/dashboard")
    return { success: true, projectId: project.id }
}
