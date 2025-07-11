import Profile from "./_components/profile";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await getServerSession(authOptions)

    // user alr logged in, so where do we redirect
    if (session) {
        return <Profile session={session} />
    } else {
        redirect("/login")
    }
}