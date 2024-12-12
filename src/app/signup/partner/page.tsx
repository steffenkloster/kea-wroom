import { Section } from "@/components/Section";
import SignupForm from "../SignupForm";
import BoxedLayout from "@/components/BoxedLayout";
import { Role } from "@/types";

export const metadata = {
  title: "Partner Signup - Wroom",
  description: "Create an account to start delivering meals to customers."
};

export default function Signup() {
  return (
    <div className="w-full h-full bg-primary">
      <Section className="h-full flex">
        <BoxedLayout>
          <h1>Partner with Wroom!</h1>
          <p className="mb-3">
            Create your account to start earning money by delivering fresh meals
            to customers in your area.
          </p>
          <SignupForm role={Role.PARTNER} />
        </BoxedLayout>
      </Section>
    </div>
  );
}
