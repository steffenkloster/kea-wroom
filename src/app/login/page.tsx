import { Section } from "@/components/Section";
import LoginForm from "./LoginForm";
import BoxedLayout from "@/components/BoxedLayout";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="w-full h-full bg-primary">
      <Section className="h-full flex">
        <BoxedLayout>
          <h1>Login</h1>
          <LoginForm />
          <hr />

          <p className="text-sm text-center">
            Forgot your password?{" "}
            <Link className="font-semibold" href="/login/forgot-password">
              Click here to reset your password.
            </Link>
          </p>
        </BoxedLayout>
      </Section>
    </div>
  );
}
