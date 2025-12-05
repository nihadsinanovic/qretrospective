import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function InvitePage({ params }: { params: { token: string } }) {
    const session = await auth()
    const { token } = await params

    // Validate token
    const invite = await prisma.invite.findUnique({
        where: { token },
        include: { project: true }
    })

    if (!invite || invite.expires < new Date()) {
        return <div className="p-8 text-center text-destructive">Invalid or expired invite</div>
    }

    // If not logged in, redirect to register with callback
    if (!session?.user?.id) {
        // We probably want to pre-fill email?
        // Redirect to register page with return url?
        // Or callbackUrl param for Auth.js?
        // Let's redirect to `/register?email=${invite.email}&callbackUrl=/invite/${token}`
        redirect(`/register?email=${invite.email}&callbackUrl=/invite/${token}`)
    }

    // If logged in, process invite

    // Check if already member
    const existingMember = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: invite.projectId,
                userId: session.user.id
            }
        }
    })

    if (!existingMember) {
        await prisma.projectMember.create({
            data: {
                projectId: invite.projectId,
                userId: session.user.id,
                role: invite.role
            }
        })
    }

    // Delete invite (or keep as record? usually delete or mark used)
    await prisma.invite.delete({ where: { token } })

    redirect(`/dashboard/project/${invite.projectId}`)
}
