"use client";

import React from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow
} from "@react-google-maps/api";
import { Button } from "./ui/button";
import Link from "next/link";
import { MapRounded } from "@mui/icons-material";

interface MapComponentProps {
  className?: string; // Optional className prop
  center?: {
    lat: number;
    lng: number;
  };
  onLocationChange?: (bounds: {
    northEast: google.maps.LatLng;
    southWest: google.maps.LatLng;
  }) => void;
  handleMapToggle?: () => void;
  markers: {
    lat: number;
    lng: number;
    title: string;
    description: string;
    id: string;
  }[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  className,
  center,
  onLocationChange,
  handleMapToggle,
  markers
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = React.useState<string>("");

  const onLoad = React.useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);

      if (onLocationChange) {
        onLocationChange({
          northEast: bounds.getNorthEast() as google.maps.LatLng,
          southWest: bounds.getSouthWest() as google.maps.LatLng
        });
      }
    },
    [center, onLocationChange]
  );

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const handleDragEnd = React.useCallback(() => {
    if (map) {
      const bounds = map.getBounds();

      if (onLocationChange) {
        onLocationChange({
          northEast: bounds?.getNorthEast() as google.maps.LatLng,
          southWest: bounds?.getSouthWest() as google.maps.LatLng
        });
      }
    }
  }, [map, onLocationChange]);

  return isLoaded ? (
    <>
      <GoogleMap
        options={{
          disableDefaultUI: true,
          maxZoom: 15
        }}
        mapContainerClassName={className}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragEnd={handleDragEnd} // Triggered when user finishes dragging the map
      >
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            icon={{
              url: "/marker.png" // Replace with your custom icon URL
              //scaledSize: new window.google.maps.Size(30, 30) // Adjust size as needed
            }}
            onClick={() =>
              selectedMarker === marker.id
                ? setSelectedMarker("")
                : setSelectedMarker(marker.id)
            }
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: markers.find((m) => m.id === selectedMarker)?.lat || 0,
              lng: markers.find((m) => m.id === selectedMarker)?.lng || 0
            }}
            onCloseClick={() => setSelectedMarker("")}
            options={{
              pixelOffset: new window.google.maps.Size(0, -48), // Adjust the offset (x, y)
              headerContent: `${
                markers.find((m) => m.id === selectedMarker)?.title
              }`
            }}
          >
            <div>
              <p>{markers.find((m) => m.id === selectedMarker)?.description}</p>
              <Button size={"sm"} className="w-full mt-3" asChild>
                <Link href={`/restaurant/${selectedMarker}`}>
                  View restaurant
                </Link>
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <Button
        size={"icon"}
        variant={"secondary"}
        className="block sm:hidden absolute top-4 right-4"
        onClick={handleMapToggle}
      >
        <MapRounded />
      </Button>
    </>
  ) : (
    <></>
  );
};

export default MapComponent;
