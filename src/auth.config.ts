import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnLogin = nextUrl.pathname.startsWith('/login')
            const isOnRegister = nextUrl.pathname.startsWith('/register')

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }

            if (isLoggedIn && (isOnLogin || isOnRegister)) {
                return Response.redirect(new URL('/dashboard', nextUrl))
            }

            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
