'use server'

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function register(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password || !name) {
        throw new Error("Missing fields")
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        // In a real app we'd return an error state, simplified here
        return { error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    })

    const callbackUrl = formData.get("callbackUrl") as string

    if (callbackUrl) {
        redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    } else {
        redirect("/login")
    }
}
