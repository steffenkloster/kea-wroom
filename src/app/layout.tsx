import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { cookies } from "next/headers";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Toaster } from "sonner";
import SessionProvider from "@/providers/SessionProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { decode, JWT } from "next-auth/jwt";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "Wroom - Fast, fresh, delicious, Wroomed straight to your door",
  description:
    "Wroom is a food delivery service that connects you with local restaurants to deliver fresh, delicious meals straight to your door."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;

  const decodedToken = token
    ? await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET!
      })
    : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={decodedToken}>
          <ReactQueryProvider>
            <Navbar />
            <main>{children}</main>
            <footer></footer>
          </ReactQueryProvider>
        </SessionProvider>
        <Toaster closeButton richColors />
      </body>
    </html>
  );
}
