"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInformationTab from "./PersonalInformationTab";
import ChangePasswordTab from "./ChangePasswordTab";
import SettingsTab from "./SettingsTab";
import { useSessionContext } from "@/providers/SessionProvider";

const ProfileTabs = () => {
  const session = useSessionContext();

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger className="text-xl" value="account">
          Personal Information
        </TabsTrigger>
        {session?.user.role === "RESTAURANT" && (
          <TabsTrigger className="text-xl" value="restaurant">
            Restaurant Information
          </TabsTrigger>
        )}
        <TabsTrigger value="password" className="text-xl">
          Password
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-xl">
          Settings
        </TabsTrigger>
      </TabsList>
      <div className="w-full max-w-screen-md mx-auto">
        <TabsContent value="account">
          <h2>Personal information</h2>
          <PersonalInformationTab />
        </TabsContent>
        <TabsContent value="password">
          <h2>Change password</h2>
          <ChangePasswordTab />
        </TabsContent>
        <TabsContent value="settings">
          <h2>Settings</h2>
          <SettingsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfileTabs;
