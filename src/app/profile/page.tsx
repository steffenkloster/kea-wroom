import { Section } from "@/components/Section";
import ProfileTabs from "./ProfileTabs";

export const metadata = {
  title: "Your Profile - Wroom",
  description: "View and edit your user profile information on Wroom."
};

const ProfilePage = () => {
  return (
    <Section padding="none" className="h-full">
      <div className="bg-secondary text-black py-8 px-4 h-full">
        <div className="w-full max-w-screen-md mx-auto">
          <h1 className="mb-3">Your profile</h1>
          <ProfileTabs />
        </div>
      </div>
    </Section>
  );
};

export default ProfilePage;
