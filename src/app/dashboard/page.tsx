import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { createProject } from "@/app/actions/project"
import { redirect } from "next/navigation"
import { CreateProjectForm } from "./CreateProjectForm"

async function getProjects() {
    const session = await auth()
    if (!session?.user?.id) return []

    return prisma.project.findMany({
        where: {
            members: {
                some: {
                    userId: session.user.id
                }
            }
        },
        include: {
            team: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const projects = await getProjects()

    // Group by team
    const projectsByTeam = projects.reduce((acc: Record<string, typeof projects>, project) => {
        const teamName = project.team.name
        if (!acc[teamName]) acc[teamName] = []
        acc[teamName].push(project)
        return acc
    }, {} as Record<string, typeof projects>)

    return (
        <div className="container py-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex gap-4 items-center">
                    <span className="text-muted">{session.user?.name || session.user?.email}</span>
                    <form action={async () => { 'use server'; await import("@/auth").then(m => m.signOut()) }}>
                        <button className="btn btn-secondary text-sm">Sign Out</button>
                    </form>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {Object.keys(projectsByTeam).length === 0 ? (
                        <div className="card text-center py-12 text-muted">
                            No projects found. Create one to get started.
                        </div>
                    ) : (
                        Object.entries(projectsByTeam).map(([teamName, teamProjects]) => (
                            <div key={teamName} className="mb-8">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-muted text-sm uppercase tracking-wide">Team</span> {teamName}
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {teamProjects.map(project => (
                                        <a key={project.id} href={`/dashboard/project/${project.id}`} className="card hover:border-primary transition-colors block">
                                            <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                                            <p className="text-xs text-muted">Updated {project.updatedAt.toLocaleDateString()}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div>
                    <div className="card sticky top-4">
                        <h2 className="font-bold text-lg mb-4">New Project</h2>
                        <CreateProjectForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
