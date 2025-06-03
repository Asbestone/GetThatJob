// File: /app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import LinkedInProvider, { LinkedInProfile } from "next-auth/providers/linkedin";

// Extend the Session type to include accessToken and idToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,

      // ① Use LinkedIn’s OIDC endpoints (no more r_liteprofile / r_basicprofile)
      issuer: "https://www.linkedin.com",
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",

      // ② Request only the “openid profile email” scopes
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },

      // ③ Pass the token auth method LinkedIn expects
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },

      // ④ Map from LinkedIn’s OIDC UserInfo into NextAuth’s User shape
      profile(profile: LinkedInProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture || null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }
        if (account.id_token) {
          token.idToken = account.id_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Expose accessToken and image from the id_token
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      // NextAuth already mapped "picture" → "session.user.image"
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
