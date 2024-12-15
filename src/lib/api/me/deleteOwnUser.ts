import { UserDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const deleteOwnUser = async (
  password: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse<UserDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<UserDTO>>(
    "/api/me",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password
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
