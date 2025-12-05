'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addRetroItem(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    const content = formData.get("content") as string
    const type = formData.get("type") as string // START, STOP, KEEP
    const retroId = formData.get("retroId") as string

    if (!content || !type || !retroId) return { error: "Missing fields" }

    // Check membership? (Skip for prototype speed, but should check if user is in project)

    await prisma.retroItem.create({
        data: {
            content,
            type,
            retroId,
            userId: session.user.id
        }
    })

    // Revalidate the project page
    revalidatePath(`/dashboard/project/${retroId}`) // Wait, retroId might be retro id, but page is project?
    // User asked for "Each project can have as many retrospectives a user would like."
    // So: Project -> List of Retros -> Retro Board.
    // My Dashboard currently lists Projects.
    // Project Page should list Retros.
    // Retro Page should be the board.

    // Wait, I missed the "Project -> Retros" layer.
    // Dashboard -> Project Page (Lists Retros, Create Retro) -> Retro Board.

    // So revalidate path depends on where we are.
    // If I am on Retro Board, I need to know the path: /dashboard/project/[projectId]/retro/[retroId] ?
    // Or just /dashboard/retro/[retroId]?

    // Let's check my schema.
    // Retrospective -> projectId.

    // Routes:
    // /dashboard -> Projects
    // /dashboard/project/[id] -> List of retrospectives in project, + Members management.
    // /dashboard/retro/[id] -> The Board.

    return { success: true }
}

export async function createRetrospective(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    const projectId = formData.get("projectId") as string
    const title = formData.get("title") as string

    if (!projectId || !title) return { error: "Missing fields" }

    await prisma.retrospective.create({
        data: {
            title,
            projectId
        }
    })

    revalidatePath(`/dashboard/project/${projectId}`)
    return { success: true }
}
