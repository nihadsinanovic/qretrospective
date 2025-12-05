'use client'

import { register } from "@/app/actions/auth"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function RegisterForm() {
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || ""
    const emailPrefill = searchParams.get("email") || ""

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const res = await register(formData)
        if (res?.error) {
            setError(res.error)
        }
    }

    return (
        <div className="card auth-card">
            <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
            {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <div>
                    <label className="text-sm text-muted mb-4 block">Name</label>
                    <input name="name" type="text" className="input" placeholder="John Doe" required />
                </div>
                <div>
                    <label className="text-sm text-muted mb-4 block">Email</label>
                    <input name="email" type="email" defaultValue={emailPrefill} className="input" placeholder="you@example.com" required />
                </div>
                <div>
                    <label className="text-sm text-muted mb-4 block">Password</label>
                    <input name="password" type="password" className="input" placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">
                    Sign Up
                </button>
            </form>
            <p className="text-center mt-4 text-sm text-muted">
                Already have an account? <a href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="text-accent hover:underline">Log in</a>
            </p>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <div className="auth-page">
            <Suspense fallback={<div>Loading...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    )
}
