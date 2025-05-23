// app/api/auth/[...nextauth]/route.ts
import NextAuth , {NextAuthOptions, Session, Account} from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import type { JWT } from "next-auth/jwt";

// 1) Configure your LinkedIn provider (make sure CLIENT_ID / SECRET are in .env)
export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email"
        }
      }
    })
  ],
  
  callbacks: {
    // Persist the LinkedIn access token into the JWT
    async jwt({ token, account }) {
      if (account?.access_token) token.accessToken = account.access_token;
      return token;
    },
    // Expose it on `session` for the client
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

// 2) Export it for both GET and POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
