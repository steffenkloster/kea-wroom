"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { useSessionContext } from "../providers/SessionProvider";
import { toast } from "sonner";
import { logoutUser } from "@/lib/api/auth/logoutUser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloseRounded, MenuRounded } from "@mui/icons-material";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const sessionContext = useSessionContext();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await logoutUser();

    sessionContext.setSession(null);

    toast.success("You have been logged out.");
    router.push("/");
  };

  const renderButtons = () => {
    if (sessionContext.session) {
      return (
        <>
          <Button variant={"ghost"} onClick={logout}>
            Log out
          </Button>
          <Link
            href={`/profile`}
            className={buttonVariants({ variant: "ghost" })}
          >
            Profile
          </Link>
          <Link
            href={`/dashboard/${sessionContext.session.role.toLowerCase()}`}
            className={buttonVariants({ variant: "default" })}
          >
            Dashboard
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
          Login
        </Link>
        <Link href="/signup" className={buttonVariants({ variant: "default" })}>
          Sign up
        </Link>
      </>
    );
  };

  return (
    <header className="top-0 sticky h-20 bg-white text-black z-30 shadow-md px-6">
      <nav>
        <div className="max-w-content relative mx-auto w-full">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <Image src="/logo.svg" alt="Logo" height={50} width={150} />
            </Link>
            <div className="gap-3 sm:flex hidden">{renderButtons()}</div>
            <Button
              size={"icon"}
              onClick={() => setMenuOpen(true)}
              className="sm:hidden"
            >
              <MenuRounded />
            </Button>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-screen z-50 bg-white py-5 px-6 flex flex-col opacity-0 pointer-events-none transition-opacity duration-300",
          menuOpen ? "!opacity-100 !pointer-events-auto" : ""
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <Image src="/logo.svg" alt="Logo" height={50} width={150} />
          <Button size={"icon"} onClick={() => setMenuOpen(false)}>
            <CloseRounded />
          </Button>
        </div>
        {sessionContext.session ? (
          <>
            <Link
              href={`/dashboard/${sessionContext.session.role.toLowerCase()}`}
              className="w-full text-lg py-3 text-center border-b border-primary"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="w-full text-lg py-3 text-center border-b border-primary"
            >
              Profile
            </Link>
            <Link
              href="#"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full text-lg py-3 text-center border-b border-primary"
            >
              Log out
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="w-full text-lg py-3 text-center border-b border-primary"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="w-full text-lg py-3 text-center border-b border-primary"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
