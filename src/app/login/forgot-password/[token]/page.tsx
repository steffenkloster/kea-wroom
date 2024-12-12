import { Section } from "@/components/Section";
import ResetForm from "./ResetForm";
import BoxedLayout from "@/components/BoxedLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Reset Password - Wroom",
  description: "Enter a new password to reset your account."
};

export default async function NewPasswordPage({
  params
}: {
  params: { token: string };
}) {
  const { token } = await params;
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token }
  });

  if (!user) {
    return (
      <div className="w-full h-full bg-primary">
        <Section className="h-full flex">
          <BoxedLayout>
            <Alert variant="destructive">
              <AlertTitle className="font-semibold">Invalid token</AlertTitle>
              <AlertDescription>
                This token does not exist or has expired.
              </AlertDescription>
            </Alert>
            <Link
              href="/login/forgot-password"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full mt-3"
              )}
            >
              Go back
            </Link>
          </BoxedLayout>
        </Section>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-primary">
      <Section className="h-full flex">
        <BoxedLayout>
          <h1>Reset password</h1>
          <ResetForm email={user.email} token={token} />
        </BoxedLayout>
      </Section>
    </div>
  );
}
