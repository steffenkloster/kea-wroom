"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { useSessionContext } from "../providers/SessionProvider";
import { toast } from "sonner";
import { logoutUser } from "@/lib/api/auth/logoutUser";

export const Navbar = () => {
  const session = useSessionContext();

  const logout = async () => {
    await logoutUser();

    toast.success("You have been logged out.");
    window.location.replace("/");
  };

  const renderButtons = () => {
    if (session) {
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
            href={`/dashboard/${session.role.toLowerCase()}`}
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
    <header className="top-0 sticky h-20 bg-white text-black z-30 shadow-md">
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

// "use client";
// import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button";
// import { useSession } from "next-auth/react";
// import { Session } from "next-auth";

// export const Navbar = () => {
//   const { data: session, status } = useSession();

//   const renderButtons = (status: string, session: Session | null) => {
//     if (status === "loading") {
//       return <p></p>;
//     }

//     if (session) {
//       return (
//         <>
//           <Link
//             href={`/${session.user.role.toLowerCase()}/profile`}
//             className={buttonVariants({ variant: "ghost" })}
//           >
//             My Profile
//           </Link>
//           <Link
//             href={`/${session.user.role.toLowerCase()}/dashboard`}
//             className={buttonVariants({ variant: "default" })}
//           >
//             Dashboard
//           </Link>
//         </>
//       );
//     }

//     return (
//       <>
//         <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
//           Login
//         </Link>
//         <Link href="/signup" className={buttonVariants({ variant: "default" })}>
//           Sign up
//         </Link>
//       </>
//     );
//   };

//   return (
//     <header className="top-0 sticky h-20 bg-white text-black z-30 shadow-md">
//       <nav>
//         <div className="max-w-content relative mx-auto w-full">
//           <div className="flex items-center justify-between h-20">
//             <p>Logo</p>
//             <div className="flex gap-3">{renderButtons(status, session)}</div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };
