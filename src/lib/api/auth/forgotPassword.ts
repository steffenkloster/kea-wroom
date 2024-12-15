import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const forgotPassword = async (
  email: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse>(
    "/api/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
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
