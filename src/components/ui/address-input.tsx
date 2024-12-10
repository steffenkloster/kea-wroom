import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Autocomplete from "react-google-autocomplete";
import { handleGetCurrentAddress } from "@/utils/location";
import { Button } from "./button";
import { toast } from "sonner";
import { NearMe, Sync } from "@mui/icons-material";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void; // Callback for place selection
  useCurrentLocation?: boolean; // Option to use current location
}

const AddressAutocompleteInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onPlaceSelected, useCurrentLocation, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    return (
      <div className="relative">
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={onPlaceSelected}
          options={{
            types: ["address"],
            bounds: {
              south: 55.5474712726, // Southwest latitude
              west: 12.2369428793, // Southwest longitude
              north: 55.8027320733, // Northeast latitude
              east: 12.7089351985 // Northeast longitude
            },
            strictBounds: true
          }}
          inputAutocompleteValue="off"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-white text-black px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
          ref={(node) => {
            inputRef.current = node as HTMLInputElement;
            if (typeof ref === "function") {
              ref(node as HTMLInputElement);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node as HTMLInputElement;
            }
          }}
        />
        {useCurrentLocation && (
          <Button
            onClick={async () => {
              setIsGettingLocation(true);

              const success = await handleGetCurrentAddress(
                process.env.NEXT_PUBLIC_GEOCODING_API_KEY || "",
                "#address" // Replace with your actual input selector
              );

              console.log("Location success:", success);
              if (!success) {
                toast.error("Location Error", {
                  description:
                    "Failed to get your current location. Please try again."
                });
              }

              setIsGettingLocation(false);
            }}
            icon={
              isGettingLocation ? (
                <Sync className="animate-spin" />
              ) : (
                <NearMe className="" />
              )
            }
            className="absolute top-12"
            variant={"ghost"}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? "Getting location" : "Use current location"}
          </Button>
        )}
      </div>
    );
  }
);

AddressAutocompleteInput.displayName = "AddressAutocompleteInput";

export { AddressAutocompleteInput };
