"use client";

import { LoadScriptNext } from "@react-google-maps/api";
import { Sync } from "@mui/icons-material";

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      loadingElement={
        <div className="flex gap-3 justify-center items-center h-screen bg-primary text-white">
          <Sync className="animate-spin" />
          <p>Loading Wroom ...</p>
        </div>
      }
    >
      <>{children}</>
    </LoadScriptNext>
  );
};
