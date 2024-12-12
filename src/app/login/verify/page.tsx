import { Section } from "@/components/Section";
import VerifyForm from "./VerifyForm";
import BoxedLayout from "@/components/BoxedLayout";

export const metadata = {
  title: "Verify Your Account - Wroom",
  description: "Verify your email address to activate your Wroom account."
};

export default function VerifyPage() {
  return (
    <div className="w-full h-full bg-primary">
      <Section className="h-full flex">
        <BoxedLayout>
          <h1>Verify your account</h1>
          <p className="mb-3">
            To be able to use Wroom, you need to verify your email address.
            Please enter the code we sent to your email.
          </p>
          <VerifyForm />
        </BoxedLayout>
      </Section>
    </div>
  );
}
