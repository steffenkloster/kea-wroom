import { RestaurantDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const getOwnRestaurant = async (
  handlers: ApiHandlers = {}
): Promise<ApiResponse<RestaurantDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;
  const result = await apiRequest<ApiResponse<RestaurantDTO>>(
    "/api/restaurants",
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
