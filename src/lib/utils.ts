import { UserTokenDTO } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { JWT } from "next-auth/jwt";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserFromJWT(token: JWT): UserTokenDTO {
  return {
    id: token.id,
    email: token.email,
    role: token.role,
    isVerified: token.isVerified,
    firstName: token.firstName,
    lastName: token.lastName
  };
}

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
