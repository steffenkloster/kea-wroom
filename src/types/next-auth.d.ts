import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    firstName: string;
    lastName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    firstName: string;
    lastName: string;
  }
}
