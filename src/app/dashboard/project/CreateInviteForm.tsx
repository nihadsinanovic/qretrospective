'use client'

import { createInvite } from "@/app/actions/invite"
import { useState } from "react"

export function CreateInviteForm({ projectId }: { projectId: string }) {
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setStatus("")

        const formData = new FormData(e.currentTarget)
        formData.append("projectId", projectId)

        const res = await createInvite(formData)
        setLoading(false)

        if (res?.error) {
            setStatus("Error: " + res.error)
        } else if (res?.success) {
            setStatus("Invite sent!")
                ; (e.target as HTMLFormElement).reset()
        }
    }

    return (
        <div className="card mt-8 border-dashed">
            <h2 className="font-bold text-lg mb-4">Invite Member</h2>
            {status && <div className={`text-sm mb-2 ${status.startsWith("Error") ? "text-destructive" : "text-green-500"}`}>{status}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-sm text-muted mb-1 block">Email</label>
                    <input name="email" type="email" className="input" placeholder="colleague@example.com" required />
                </div>
                <div>
                    <label className="text-sm text-muted mb-1 block">Role</label>
                    <select name="role" className="input bg-input border-border">
                        <option value="VIEWER">Viewer</option>
                        <option value="EDITOR">Editor</option>
                        <option value="OWNER">Owner</option>
                    </select>
                </div>
                <button disabled={loading} className="btn btn-secondary w-full">
                    {loading ? "Sending..." : "Send Invite"}
                </button>
            </form>
        </div>
    )
}
