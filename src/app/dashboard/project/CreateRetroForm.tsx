'use client'

import { createRetrospective } from "@/app/actions/retro"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateRetroForm({ projectId }: { projectId: string }) {
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        // Ensure projectId is included if not in form
        formData.append("projectId", projectId)

        const res = await createRetrospective(formData)

        if (res?.error) {
            setError(res.error)
        } else if (res?.success) {
            (e.target as HTMLFormElement).reset()
            router.refresh()
        }
    }

    return (
        <>
            {error && <div className="text-destructive text-sm mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-sm text-muted mb-1 block">Title</label>
                    <input name="title" className="input" placeholder="e.g. Sprint 10" required />
                </div>
                <button className="btn btn-primary w-full">Start Retro</button>
            </form>
        </>
    )
}
