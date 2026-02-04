
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"

import GoogleProvider from "next-auth/providers/google"


const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        })
        // ...add more providers here
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, account }) {
            // NEVER return null/undefined
            if (account?.access_token) token.accessToken = account.access_token
            return token
        },
        async session({ session, token }) {
            // NEVER return null/undefined
            session.accessToken = token.accessToken as string | undefined
            return session
        },
    },
    debug: true,
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }
