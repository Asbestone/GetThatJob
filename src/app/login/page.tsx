import LinkedinLogin from "./_components/linkedinlogin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LoginPage() {
    const session = await getServerSession(authOptions)

    // user alr logged in, so where do we redirect
    if (session) {
        redirect("/")
    }

    return <LinkedinLogin />
}