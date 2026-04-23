import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

const ADMIN_CREDENTIALS = [
  { email: "admin@growxlabs.tech", password: "VARSHITH973206", name: "Varshith", role: "ADMIN" },
  { email: "coadmin@growxlabs.tech", password: "AKHILESH", name: "Akhilesh", role: "CO_ADMIN" },
  { email: "test@growxlabs.tech", password: "GrowXTest2024!", name: "Razorpay Tester", role: "CLIENT" }
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // 1. Priority Hardcoded Check
        const hardcoded = ADMIN_CREDENTIALS.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (hardcoded) {
          return {
            id: "hardcoded-" + hardcoded.role.toLowerCase(),
            email: hardcoded.email,
            name: hardcoded.name,
            role: hardcoded.role,
          };
        }

        // 2. Database Fallback
        const supabase = await createClient();
        
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "uEa8K39ZpL2vNq5rT7wX9yB2mC5nE8pQ",
});

export { handler as GET, handler as POST };
