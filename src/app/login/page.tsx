'use client'

import { signIn } from "next-auth/react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState("")
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl
        })

        if (res?.error) {
            setError("Invalid credentials")
        } else {
            // NextAuth redirect: false doesn't automatically redirect.
            // We need to manually redirect to the callbackUrl
            router.push(callbackUrl)
            router.refresh()
        }
    }

    return (
        <div className="card auth-card">
            <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
            {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-sm text-muted mb-4 block">Email</label>
                    <input name="email" type="email" className="input" placeholder="you@example.com" required />
                </div>
                <div>
                    <label className="text-sm text-muted mb-4 block">Password</label>
                    <input name="password" type="password" className="input" placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">
                    Log In
                </button>
            </form>
            <p className="text-center mt-4 text-sm text-muted">
                Don't have an account? <a href={`/register${callbackUrl && callbackUrl !== '/dashboard' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="text-accent hover:underline">Sign up</a>
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="auth-page">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
