import { RestaurantDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const getRestaurant = async (
  restaurantId: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse<RestaurantDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<RestaurantDTO>>(
    `/api/public/restaurants/${restaurantId}`,
    {
      method: "GET"
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
