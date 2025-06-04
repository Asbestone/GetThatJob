import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
    // Pull the NextAuth JWT (which has user.id, user.name, user.email, user.image)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    // Build a minimal “user profile” object
    const userData = {
        id: token.sub,
        name: (token as any).name,
        email: (token as any).email,
        image: (token as any).picture || null,
    }

    return NextResponse.json({ user: userData })
}