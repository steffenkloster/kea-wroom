"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer
} from "@react-google-maps/api";
import { OrderDTO } from "@/types";
import { getCoordinates } from "@/utils/location";
import { Button } from "./ui/button";
import {
  DirectionsCarRounded,
  DirectionsBikeRounded,
  DirectionsWalkRounded
} from "@mui/icons-material";

interface RouteMapProps {
  addressDeliverTo: string;
  addressPickUp: string;
  order: OrderDTO;
  duration?: string;
  distance?: string;
}

const containerStyle = {
  width: "100%",
  height: "500px"
};

const RouteMap: React.FC<RouteMapProps> = ({
  order,
  addressDeliverTo,
  addressPickUp,
  duration,
  distance
}) => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<string | null>(null);

  const [pickUpCoordinates, setPickUpCoordinates] =
    useState<google.maps.LatLng | null>(null);
  const [deliverToCoordinates, setDeliverToCoordinates] =
    useState<google.maps.LatLng | null>(null);

  const geocodeAddress = async (
    address: string
  ): Promise<google.maps.LatLng | null> => {
    try {
      const coordinates = await getCoordinates(address);
      if (coordinates) {
        return coordinates;
      }
      return null;
    } catch (err) {
      console.error("Error geocoding address:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      const pickUpCoords = await geocodeAddress(addressPickUp);
      const deliverToCoords = await geocodeAddress(addressDeliverTo);

      // Only update state if coordinates are different
      setPickUpCoordinates((prev) =>
        pickUpCoords?.equals(prev) ? prev : pickUpCoords
      );
      setDeliverToCoordinates((prev) =>
        deliverToCoords?.equals(prev) ? prev : deliverToCoords
      );
    };
    fetchCoordinates();
  }, [addressPickUp, addressDeliverTo]);

  useEffect(() => {
    if (window.google && !travelMode) {
      setTravelMode("BICYCLING");
    }
  }, [travelMode]);

  const handleDirectionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === "OK" && result) {
        setDirectionsResponse((prev) =>
          JSON.stringify(prev) === JSON.stringify(result) ? prev : result
        );
        setError(null);
      } else {
        console.error("Directions request failed due to: ", status);
        setError("Could not calculate the route. Please try again.");
      }
    },
    []
  );

  const mapCenter = useMemo(
    () => pickUpCoordinates || { lat: 55.6761, lng: 12.5683 }, // Default to Copenhagen if no coordinates
    [pickUpCoordinates]
  );

  const getIcon = (mode: string) => {
    switch (mode) {
      case "DRIVING":
        return <DirectionsCarRounded />;
      case "BICYCLING":
        return <DirectionsBikeRounded />;
      case "WALKING":
        return <DirectionsWalkRounded />;
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <div className="relative ">
        {/* Travel Mode Buttons */}
        {travelMode && (
          <div className="absolute top-16 right-2 flex flex-col gap-2 z-10">
            {["DRIVING", "BICYCLING", "WALKING"].map((mode) => (
              <Button
                key={mode}
                variant={
                  travelMode ===
                  google.maps.TravelMode[
                    mode as keyof typeof google.maps.TravelMode
                  ]
                    ? "default"
                    : "secondary"
                }
                onClick={() => setTravelMode(mode)}
              >
                {getIcon(mode)}
              </Button>
            ))}
          </div>
        )}

        {/* Map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={7}
          center={mapCenter}
        >
          {travelMode && pickUpCoordinates && deliverToCoordinates && (
            <DirectionsService
              options={{
                origin: pickUpCoordinates,
                destination: deliverToCoordinates,
                travelMode:
                  google.maps.TravelMode[
                    travelMode as keyof typeof google.maps.TravelMode
                  ]
              }}
              callback={handleDirectionsCallback}
            />
          )}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>

        {/* Error Handling */}
        {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      </div>
    </LoadScript>
  );
};

export default RouteMap;
