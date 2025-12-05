import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    const isOnLogin = req.nextUrl.pathname.startsWith('/login')
    const isOnRegister = req.nextUrl.pathname.startsWith('/register')

    if (isOnDashboard) {
        if (isLoggedIn) return
        return Response.redirect(new URL('/login', req.nextUrl))
    }

    if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/dashboard', req.nextUrl))
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
