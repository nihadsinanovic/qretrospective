import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { RetroBoard } from "../../../RetroBoard"

export default async function RetroPage({ params }: { params: { id: string, retroId: string } }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id: projectId, retroId } = await params

    // Fetch retro and items
    const retro = await prisma.retrospective.findUnique({
        where: { id: retroId },
        include: {
            items: true,
            project: {
                include: {
                    team: true
                }
            }
        }
    })

    if (!retro || retro.projectId !== projectId) notFound()

    return (
        <div className="container py-8 h-screen flex flex-col">
            <header className="mb-6">
                <div className="text-sm text-muted mb-1">
                    <a href="/dashboard" className="hover:underline">Dashboard</a> / <a href={`/dashboard/project/${projectId}`} className="hover:underline">{retro.project.team.name} / {retro.project.name}</a>
                </div>
                <h1 className="text-3xl font-bold">{retro.title}</h1>
            </header>

            <div className="flex-1">
                <RetroBoard
                    retroId={retro.id}
                    initialItems={retro.items}
                    currentUser={{ id: session.user.id as string, name: session.user.name }}
                />
            </div>
        </div>
    )
}
