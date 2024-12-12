import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Fetch user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if user is soft-deleted
        if (user.isDeleted) {
          throw new Error("This account has been deactivated");
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return user object on successful login
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isBlocked: user.isBlocked,
          isDeleted: user.isDeleted,
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
          isVerified: token.isVerified,
          isBlocked: token.isBlocked,
          isDeleted: token.isDeleted,
          firstName: token.firstName,
          lastName: token.lastName
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.isBlocked = user.isBlocked;
        token.isDeleted = user.isDeleted;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  useSecureCookies: process.env.NODE_ENV === "production"
};

const handler = NextAuth(authOptions);

export { authOptions };
export { handler as GET, handler as POST };
