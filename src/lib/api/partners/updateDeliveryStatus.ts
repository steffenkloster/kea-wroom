import { OrderDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const updateDeliveryStatus = async (
  orderId: string,
  status: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse<OrderDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<OrderDTO>>(
    `/api/partners/orders/${orderId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
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
