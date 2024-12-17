"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { useSessionContext } from "../providers/SessionProvider";
import { toast } from "sonner";
import { logoutUser } from "@/lib/api/auth/logoutUser";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const sessionContext = useSessionContext();
  const router = useRouter();

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
            <div className="flex gap-3">{renderButtons()}</div>
          </div>
        </div>
      </nav>
    </header>
  );
};
