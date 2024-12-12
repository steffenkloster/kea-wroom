import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils.server";

export default async function RedirectPage(req: NextRequest) {
  const user = await getUser(req);
  if (user instanceof NextResponse) {
    return redirect("/login");
  }

  redirect(`/dashboard/${user.role.toLowerCase()}`);
}
