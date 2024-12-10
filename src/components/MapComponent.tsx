"use client";

import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

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
  markers: { lat: number; lng: number }[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  className,
  center,
  onLocationChange,
  markers
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

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
          position={{ lat: marker.lat, lng: marker.lng }}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
