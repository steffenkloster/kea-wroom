import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const logoutUser = async (handlers: ApiHandlers = {}) => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse>(
    "/api/auth/logout",
    {
      method: "POST"
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
