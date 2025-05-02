// app/api/linkedinlogin/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LINKEDIN_ME_URL = 
  'https://api.linkedin.com/v2/me?' +
  'projection=(id,localizedFirstName,localizedLastName,headline,' +
  'positions*(title,company*(name)))';

export async function GET(req: NextRequest) {
  // Extract the NextAuth JWT (which contains accessToken via your jwt callback)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Call LinkedIn’s “me” endpoint
  const linkedinRes = await fetch(LINKEDIN_ME_URL, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  });

  if (!linkedinRes.ok) {
    const errText = await linkedinRes.text();
    return NextResponse.json(
      { error: errText },
      { status: linkedinRes.status }
    );
  }

  const profile = await linkedinRes.json();
  return NextResponse.json(profile);
}
