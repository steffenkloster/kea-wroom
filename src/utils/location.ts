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
