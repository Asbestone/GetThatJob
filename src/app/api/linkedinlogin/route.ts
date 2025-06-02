// File: /app/api/linkedinlogin/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// → If you have “r_fullprofile” or an approved equivalent, you can project positions + company name:
const LINKEDIN_ME_URL =
  "https://api.linkedin.com/v2/me?" +
  "projection=(id,localizedFirstName,localizedLastName,headline,positions*(id,title,company*(name)))";

export async function GET(req: NextRequest) {
  // 1) Extract NextAuth’s JWT (which contains accessToken)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Fetch LinkedIn’s /v2/me with everything you asked for
  const linkedinRes = await fetch(LINKEDIN_ME_URL, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });

  if (!linkedinRes.ok) {
    const errText = await linkedinRes.text();
    return NextResponse.json(
      { error: "LinkedIn returned an error", details: errText },
      { status: linkedinRes.status }
    );
  }

  // 3) Return the raw JSON exactly as LinkedIn sent it
  const data = await linkedinRes.json();
  return NextResponse.json(data);
}
