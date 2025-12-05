import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { createRetrospective } from "@/app/actions/retro"
import { notFound, redirect } from "next/navigation"
import { CreateRetroForm } from "../CreateRetroForm"
import { CreateInviteForm } from "../CreateInviteForm"

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // params is a Promise in Next.js 15? Or standard? 
    // In Next 15 `params` is async. I'll await it if needed, or assume Next 14 style where it's prop.
    // create-next-app@latest is Next 15 (probably).
    // I should await params.
    const { id } = await params

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            retros: {
                orderBy: { createdAt: 'desc' }
            },
            members: {
                include: { user: true }
            },
            team: true
        }
    })

    if (!project) notFound()

    type ProjectMemberWithUser = typeof project.members[number]
    type Retrospective = typeof project.retros[number]

    // Check access
    const isMember = project.members.some((m: ProjectMemberWithUser) => m.userId === session.user?.id)
    if (!isMember) return <div className="p-8 text-center text-destructive">Access Denied</div>

    return (
        <div className="container py-8">
            <header className="mb-8">
                <div className="text-sm text-muted mb-1">
                    <a href="/dashboard" className="hover:underline">Dashboard</a> / {project.team.name}
                </div>
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    {/* Placeholder for invite */}
                    <button className="btn btn-secondary text-sm">Manage Team / Invite</button>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Retrospectives</h2>
                    {project.retros.length === 0 ? (
                        <div className="card py-8 text-center text-muted">
                            No retrospectives yet.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {project.retros.map((retro: Retrospective) => (
                                <a key={retro.id} href={`/dashboard/project/${project.id}/retro/${retro.id}`} className="card hover:border-primary transition-colors flex justify-between items-center group">
                                    <div>
                                        <h3 className="font-bold">{retro.title}</h3>
                                        <div className="text-xs text-muted">{retro.createdAt.toLocaleDateString()}</div>
                                    </div>
                                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="card sticky top-4">
                        <h2 className="font-bold text-lg mb-4">New Retrospective</h2>
                        <CreateRetroForm projectId={project.id} />
                    </div>

                    <CreateInviteForm projectId={project.id} />

                    <div className="card mt-8">
                        <h2 className="font-bold text-lg mb-4">Members</h2>
                        <ul className="space-y-2">
                            {project.members.map((member: ProjectMemberWithUser) => (
                                <li key={member.id} className="flex items-center justify-between text-sm">
                                    <span>{member.user.name || member.user.email}</span>
                                    <span className="text-xs px-2 py-1 bg-muted rounded">{member.role}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
