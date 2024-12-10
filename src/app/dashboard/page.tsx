import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function RedirectPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  redirect(`/dashboard/${session.user.role.toLowerCase()}`);
}
