import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
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

        const emailLower = credentials.email.toLowerCase().trim();

        // 1. Try finding in 'users' table (Clients/Admins)
        let { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", emailLower)
          .single();

        let isValid = false;
        let userData = null;

        if (user && !error) {
          isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            userData = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }

        // 2. If not found or invalid in 'users', try 'team_members' table (CRM Agents)
        if (!userData) {
          const { data: member, error: memberError } = await supabaseAdmin
            .from("team_members")
            .select("*")
            .eq("email", emailLower)
            .eq("is_active", true)
            .single();

          if (memberError) {
            console.error(`Database lookup error for ${emailLower}:`, memberError);
          }

          if (member && !memberError) {
            isValid = await bcrypt.compare(credentials.password, member.password_hash);
            
            if (isValid) {
              userData = {
                id: member.id,
                email: member.email,
                name: member.name,
                role: member.role || "crm_agent",
                allowed_paths: member.allowed_paths || [],
              };
            }
          }
        }

        if (!userData) {
          console.warn(`Auth failure: Invalid credentials for ${emailLower}`);
          throw new Error("Invalid email or password");
        }

        return userData;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: any }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.allowed_paths = (user as any).allowed_paths || [];
      }

      // Block and invalidate co-admin sessions
      if (
        token.role === "CO_ADMIN" ||
        token.email === "coadmin@growxlabs.tech" ||
        token.email === "coadmin-suspended@growxlabs.tech"
      ) {
        token.role = "CLIENT";
        token.id = "";
        token.email = "";
      }

      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      // Invalidate co-admin sessions
      if (
        token.role === "CO_ADMIN" ||
        session.user?.role === "CO_ADMIN" ||
        session.user?.email === "coadmin@growxlabs.tech" ||
        session.user?.email === "coadmin-suspended@growxlabs.tech"
      ) {
        session.user = null;
        return null;
      }

      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).allowed_paths = (token as any).allowed_paths || [];
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
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.growxlabs.tech' : undefined,
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

