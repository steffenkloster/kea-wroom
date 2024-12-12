import { Section } from "@/components/Section";
import BoxedLayout from "@/components/BoxedLayout";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password - Wroom",
  description: "Recover your account by resetting your password on Wroom."
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full h-full bg-primary">
      <Section className="h-full flex">
        <BoxedLayout>
          <h1>Forgot password</h1>
          <p>
            Reset your password here, by inputting your e-mail. We&apos;ll send
            you a link to reset it then.
          </p>
          <ForgotPasswordForm />
        </BoxedLayout>
      </Section>
    </div>
  );
}
