"use client";

import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllRestaurants } from "@/lib/api/public/getAllRestaurants";
import { RestaurantDTO } from "@/types";
import { handleGetCurrentLocation } from "@/lib/location";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapRounded } from "@mui/icons-material";
import { cn } from "@/lib/utils";

const CustomerDashboard = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 55.679898, longitude: 12.573239 });
  const [query, setQuery] = useState("");

  const { isLoading, data } = useQuery({
    queryKey: ["getAllRestaurants"],
    queryFn: async (): Promise<RestaurantDTO[] | null> => {
      const response = await getAllRestaurants();
      if (response) {
        return response.data as RestaurantDTO[];
      }

      return null;
    }
  });

  const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    RestaurantDTO[]
  >([]);
  const [mapHidden, setMapHidden] = useState(true);

  useEffect(() => {
    if (data) {
      setRestaurants(data);
      setFilteredRestaurants(data);
    }
  }, [data]);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();

    setFilteredRestaurants(
      restaurants.filter((restaurant) => {
        return (
          restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
          restaurant.description?.toLowerCase().includes(lowerCaseQuery)
        );
      })
    );
  }, [query, restaurants]);

  useEffect(() => {
    const getLocaton = async () => {
      const location = await handleGetCurrentLocation();
      if (location) {
        setLocation(location);
      }
    };

    getLocaton();
  }, []);

  const onLocationChange = (bounds: {
    northEast: google.maps.LatLng;
    southWest: google.maps.LatLng;
  }) => {
    console.log("Bounds changed:", bounds);
  };

  const handleMapToggle = () => {
    setMapHidden(!mapHidden);
  };

  const markers = useMemo(() => {
    return filteredRestaurants.map((restaurant) => {
      return {
        lat: restaurant.latitude,
        lng: restaurant.longitude,
        title: restaurant.name,
        description: restaurant.description || "",
        id: restaurant.id
      };
    });
  }, [filteredRestaurants]);

  return (
    <div className="flex h-full w-full">
      <div
        className={cn(
          "h-[calc(100vh-80px)] w-full sm:w-96",
          mapHidden ? "" : "!hidden"
        )}
      >
        <section className="sm:w-96 w-full flex-shrink-0 sm:rounded-r-lg bg-primary -mr-1 z-10 shadow-xl drop-shadow-xl h-full overflow-scroll relative">
          <div className="p-4 sticky top-0 z-10 bg-primary flex gap-3 w-full">
            <Input
              placeholder="Search for restaurants ..."
              value={query}
              className="w-full"
              fullWidth={true}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Button
              size={"icon"}
              variant={"secondary"}
              className="block sm:hidden flex-shrink-0"
              onClick={handleMapToggle}
            >
              <MapRounded />
            </Button>
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4 p-4 pt-0">
              {filteredRestaurants?.map((restaurant, index) => (
                <div key={restaurant.id} className="bg-white rounded-lg">
                  <div className="relative h-24 w-full">
                    <img
                      src={`/restaurant-${index % 3}.jpeg`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4 text-black">
                    <h2 className="text-base md:text-lg lg:text-xl">
                      {restaurant.name}
                    </h2>
                    <p className="text-sm">{restaurant.description}</p>
                    <Button className="w-full mt-3" asChild>
                      <Link href={`/restaurant/${restaurant.id}`}>
                        View restaurant
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <div
        className={cn(
          "hidden sm:block w-full relative",
          mapHidden ? "" : "!block"
        )}
      >
        <MapComponent
          center={{
            lat: location.latitude,
            lng: location.longitude
          }}
          className="h-full w-full"
          onLocationChange={onLocationChange}
          handleMapToggle={handleMapToggle}
          markers={markers}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
