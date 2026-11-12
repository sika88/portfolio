import NextAuth from "next-auth";
import type { Session } from "next-auth";
import Google from "next-auth/providers/google";

const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    // Only the admin's verified Google account can sign in at all
    signIn({ profile }) {
      return (
        !!adminEmail &&
        profile?.email_verified === true &&
        profile.email?.toLowerCase() === adminEmail
      );
    },
  },
});

export function isAdminSession(session: Session | null) {
  return !!adminEmail && session?.user?.email?.toLowerCase() === adminEmail;
}