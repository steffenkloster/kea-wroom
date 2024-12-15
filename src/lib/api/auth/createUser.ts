import { UserTokenDTO } from "@/types";
import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

export const createUser = async (
  userData: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    restaurantName?: string;
    restaurantAddress?: string;
    restaurantCity?: string;
    restaurantZipCode?: string;
  },
  handlers: ApiHandlers = {}
): Promise<ApiResponse<UserTokenDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<UserTokenDTO>>(
    "/api/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
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
