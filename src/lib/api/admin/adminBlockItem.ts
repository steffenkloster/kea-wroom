import { ItemDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const adminBlockItem = async (
  itemId: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse<ItemDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<ItemDTO>>(
    `/api/admin/items/${itemId}/block`,
    {
      method: "PATCH"
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
