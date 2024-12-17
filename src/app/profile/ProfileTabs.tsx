"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInformationTab from "./PersonalInformationTab";
import ChangePasswordTab from "./ChangePasswordTab";
import SettingsTab from "./SettingsTab";
import { useSessionContext } from "@/providers/SessionProvider";
import RestaurantInformationTab from "./RestaurantInformationTab";
import OrdersTab from "./OrdersTab";

const ProfileTabs = () => {
  const sessionContext = useSessionContext();

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger className="text-lg" value="account">
          Personal Information
        </TabsTrigger>
        {sessionContext.session?.role === "RESTAURANT" && (
          <TabsTrigger className="text-lg" value="restaurant">
            Restaurant Information
          </TabsTrigger>
        )}
        {sessionContext.session?.role === "CUSTOMER" && (
          <TabsTrigger className="text-lg" value="orders">
            Orders
          </TabsTrigger>
        )}
        <TabsTrigger value="password" className="text-lg">
          Change Password
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-lg">
          Settings
        </TabsTrigger>
      </TabsList>
      <div className="w-full max-w-screen-md mx-auto">
        <TabsContent value="account">
          <h2>Personal information</h2>
          <PersonalInformationTab />
        </TabsContent>
        <TabsContent value="restaurant">
          <h2>Restaurant information</h2>
          <RestaurantInformationTab />
        </TabsContent>
        <TabsContent value="orders">
          <h2>Your orders</h2>
          <OrdersTab />
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
