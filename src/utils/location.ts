export async function handleGetCurrentAddress(
  geocodingApiKey: string,
  inputSelector: string
): Promise<boolean> {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by your browser.");
    return false;
  }

  try {
    // Use Promise to handle success or error from geolocation
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    const { latitude, longitude } = position.coords;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${geocodingApiKey}`
    );

    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const userAddress = data.results[0].formatted_address;

      const inputElement = document.querySelector(
        inputSelector
      ) as HTMLInputElement;

      if (inputElement) {
        inputElement.value = userAddress;
        return true; // Success
      }
    }

    console.error("Failed to populate address field.");
    return false; // Failure
  } catch (error) {
    console.error("Error getting location or geocoding:", error);
    return false; // Failure
  }
}

export async function handleGetCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by your browser.");
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );

    const { latitude, longitude } = position.coords;

    return {
      latitude,
      longitude
    };
  } catch {
    return null; // Failure
  }
}

export const getDistance = async (
  origin: string,
  destination: string
): Promise<{ distance: string; duration: string } | null> => {
  try {
    const response = await fetch(
      `/api/partners/distance?origins=${encodeURIComponent(
        origin
      )}&destinations=${encodeURIComponent(destination)}`
    );

    if (!response.ok) {
      console.error("Error fetching distance:", response.statusText);
      return null;
    }

    const json = await response.json();
    console.log(json);

    if (json.data.rows[0]?.elements[0]?.status === "OK") {
      const distance = json.data.rows[0].elements[0].distance.text;
      const duration = json.data.rows[0].elements[0].duration.text;
      return { distance, duration };
    } else {
      console.error("Error with Distance Matrix response:", json);
      return null;
    }
  } catch (error) {
    console.error("Error fetching distance:", error);
    return null;
  }
};

export const getCoordinates = async (
  address: string
): Promise<google.maps.LatLng | null> => {
  try {
    const response = await fetch(
      `/api/partners/coordinates?address=${encodeURIComponent(address)}`
    );

    if (!response.ok) {
      console.error("Error fetching distance:", response.statusText);
      return null;
    }

    const json = await response.json();
    const data = json.data;

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      console.log("Coordinates address:", address, lat, lng);
      return new google.maps.LatLng(lat, lng);
    } else {
      console.error("No results found for address:", address, data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching distance:", error);
    return null;
  }
};
