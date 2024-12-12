import { Section } from "@/components/Section";
import SignupFormRestaurant from "./SignupFormRestaurant";
import BoxedLayout from "@/components/BoxedLayout";
import { Role } from "@/types";

export const metadata = {
  title: "Restaurant Signup - Wroom",
  description: "Create an account to start selling takeaway meals to customers."
};

export default function Signup() {
  return (
    <div className="w-full h-full bg-primary">
      <Section className="h-full flex">
        <BoxedLayout>
          <h1>Sell takeaway on Wroom!</h1>
          <p className="mb-3">
            Create your account to start selling takeaway meals to customers in
            your area. We&apos;ll handle the delivery for you!
          </p>
          <SignupFormRestaurant role={Role.RESTAURANT} />
        </BoxedLayout>
      </Section>
    </div>
  );
}
