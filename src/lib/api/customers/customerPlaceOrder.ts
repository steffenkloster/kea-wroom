import { CartItem, OrderDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const customerPlaceOrder = async (
  restaurantId: string,
  items: CartItem[],
  handlers: ApiHandlers = {}
): Promise<ApiResponse<OrderDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => {
      console.log("Success:", data);
    },
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<OrderDTO>>(
    "/api/customers/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        restaurantId,
        items
      })
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
