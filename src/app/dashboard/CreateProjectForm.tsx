'use client'

import { createProject } from "@/app/actions/project"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateProjectForm() {
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const res = await createProject(formData)

        if (res?.error) {
            setError(res.error)
        } else if (res?.success) {
            // Optional: redirect to new project
            // router.push(`/dashboard/project/${res.projectId}`)
            // For now just clear form or refresh
            (e.target as HTMLFormElement).reset()
            router.refresh()
        }
    }

    return (
        <>
            {error && <div className="text-destructive text-sm mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-sm text-muted mb-1 block">Project Name</label>
                    <input name="name" className="input" placeholder="e.g. Q4 Review" required />
                </div>
                <div>
                    <label className="text-sm text-muted mb-1 block">Team Name</label>
                    <input name="teamName" className="input" placeholder="e.g. Engineering" required />
                </div>
                <button className="btn btn-primary w-full">Create Project</button>
            </form>
        </>
    )
}
