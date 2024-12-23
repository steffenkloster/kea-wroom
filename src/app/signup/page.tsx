import { Section } from "@/components/Section";
import SignupForm from "./SignupForm";
import BoxedLayout from "@/components/BoxedLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup - Wroom",
  description:
    "Create an account to start ordering meals from local restaurants."
};

export default function Signup() {
  return (
    <div className="w-full h-full bg-primary">
      <Section className="h-full flex">
        <BoxedLayout>
          <h1>Join Wroom today!</h1>
          <p className="mb-3">
            Create your account to order fresh meals, explore local restaurants,
            and enjoy fast, reliable delivery straight to your door.
          </p>
          <SignupForm />
        </BoxedLayout>
      </Section>
    </div>
  );
}
