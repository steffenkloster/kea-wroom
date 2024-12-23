import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { SessionProvider } from "@/providers/SessionProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { getTokenFromCookies } from "@/lib/utils.server";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";

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
    "Wroom is a food delivery service that connects you with local restaurants to deliver fresh, delicious meals straight to your door.",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png"
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = await getTokenFromCookies(cookieStore);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleMapsProvider>
          <SessionProvider token={token}>
            <ReactQueryProvider>
              <Navbar />
              <main>{children}</main>
              <footer></footer>
            </ReactQueryProvider>
          </SessionProvider>
        </GoogleMapsProvider>
        <Toaster closeButton richColors />
      </body>
    </html>
  );
}
