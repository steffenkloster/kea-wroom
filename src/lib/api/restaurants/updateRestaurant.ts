import { RestaurantDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const updateRestaurant = async (
  restaurantData: {
    name: string;
    description?: string;
    address: string;
    city: string;
    zipCode: string;
  },
  handlers: ApiHandlers = {}
): Promise<ApiResponse<RestaurantDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<RestaurantDTO>>(
    `/api/restaurants/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(restaurantData)
    },
    (data) => {
      onSuccess(data);
      return data;
    },
    onError,
    setLoading,
    finallyCallback
  );

  return result;
};
