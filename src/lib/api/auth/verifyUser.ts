import { UserTokenDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const verifyUser = async (
  verificationToken: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse<UserTokenDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<UserTokenDTO>>(
    "/api/auth/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        verificationToken
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
