import { toast } from "sonner";
import {
  ApiHandlers,
  CartItem,
  ItemDTO,
  OrderDTO,
  RestaurantDTO,
  UserDTO,
  UserTokenDTO
} from "@/types";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: BodyInit | null;
}

interface ApiResponse<T = undefined> {
  data?: T;
  error?: string;
  message?: string;
}

//type onSuccessType<T> = (data: T) => void;
type setLoadingType = (isLoading: boolean) => void;

/**
 * Performs an API request and handles the response.
 * @param url The endpoint URL.
 * @param options Fetch options, including method, headers, and body.
 * @param onSuccess Callback function to handle successful responses.
 * @param onError Callback function to handle errors.
 * @param setLoading (Optional) Function to update loading state. If not provided, does nothing.
 * @param finallyCallback (Optional) Callback function to run after the request completes.
 */
const apiRequest = async <T>(
  url: string,
  options: RequestOptions,
  onSuccess: (data: T) => T,
  onError: (error: { statusCode: number; error: string }) => void,
  setLoading: setLoadingType = () => {},
  finallyCallback?: () => void
): Promise<T | null> => {
  setLoading(true);
  try {
    const response = await fetch(url, options);
    const statusCode = response.status;

    if (response.ok) {
      if (statusCode === 204) {
        onSuccess({} as T);
        return null;
      }

      const data: T = await response.json();
      return onSuccess(data);
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.error || "An unknown error occurred";
      onError({ statusCode, error: errorMessage });
      return null;
    }
  } catch (error) {
    console.error("API request error:", error);

    const structuredError = handleError(
      error instanceof Error ? error.message : "An unknown error occurred",
      500
    );

    onError(structuredError);
    return null;
  } finally {
    setLoading(false);
    if (finallyCallback) {
      finallyCallback();
    }
  }
};

const defaultOnError = (error: { statusCode: number; error: string }): void => {
  if (error.statusCode.toString().startsWith("4")) {
    toast.error(error.error);
    return;
  }

  toast.error("An error occurred. Please try again later.");
};

const handleError = (
  error: string | Error,
  statusCode: number = 500
): { statusCode: number; error: string } => {
  let message = "An unknown error occurred";
  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Return the actual status code and the error message
  return { statusCode, error: message };
};

// ----------- USERS -----------

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
    "/api/users",
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

export const loginUser = async (
  userData: {
    email: string;
    password: string;
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
    "/api/auth/login",
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
    "/api/users/verify",
    {
      method: "PATCH",
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

export const resendVerificationCode = async (
  handlers: ApiHandlers = {}
): Promise<ApiResponse | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse>(
    "/api/users/verification-code",
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
    "/api/users/restaurant",
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

export const getOwnUser = async (
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

export const updateOwnUser = async (
  userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    password?: string;
  },
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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...userData
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

export const resetPassword = async (
  userData: {
    email: string;
    token: string;
    password: string;
  },
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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...userData })
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

export const userPlaceOrder = async (
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
    "/api/orders",
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

// ----------- RESTAURANT -----------

export const createItem = async (
  itemData: {
    name: string;
    description: string;
    price: number;
    images: File[];
  },
  handlers: ApiHandlers = {}
): Promise<ApiResponse | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const formData = new FormData();
  formData.append("name", itemData.name);
  formData.append("description", itemData.description);
  formData.append("price", itemData.price.toString());
  itemData.images.forEach((image) => {
    formData.append("images", image);
  });

  const result = await apiRequest<ApiResponse>(
    "/api/restaurant/items",
    {
      method: "POST",
      body: formData
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

export const getItems = async (
  handlers: ApiHandlers = {}
): Promise<ApiResponse<ItemDTO[]> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<ItemDTO[]>>(
    "/api/restaurant/items",
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

export const deleteItem = async (
  itemId: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse>(
    `/api/restaurant/items/${itemId}`,
    {
      method: "DELETE"
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

export const getItem = async (
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
    `/api/restaurant/items/${itemId}`,
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

export const updateItem = async (
  itemId: string,
  itemData: {
    name: string;
    description: string;
    price: number;
    images: File[];
  },
  handlers: ApiHandlers = {}
): Promise<ApiResponse | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const formData = new FormData();
  formData.append("name", itemData.name);
  formData.append("description", itemData.description);
  formData.append("price", itemData.price.toString());
  itemData.images.forEach((image) => {
    formData.append("images", image);
  });

  const result = await apiRequest<ApiResponse>(
    `/api/restaurant/items/${itemId}`,
    {
      method: "PUT",
      body: formData
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

export const updateRestaurant = async (
  restaurantId: string,
  restaurantData: {
    name: string;
    description?: string;
    address: string;
    city: string;
    zipCode: string;
  },
  handlers: ApiHandlers = {}
): Promise<ApiResponse<RestaurantDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<RestaurantDTO>>(
    `/api/restaurant/${restaurantId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(restaurantData)
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

export const getOrders = async (
  handlers: ApiHandlers = {}
): Promise<ApiResponse<OrderDTO[]> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<OrderDTO[]>>(
    "/api/restaurant/orders",
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

export const getAllRestaurants = async (
  handlers: ApiHandlers = {}
): Promise<ApiResponse<RestaurantDTO[]> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<RestaurantDTO[]>>(
    "/api/restaurant",
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
    `/api/restaurant/${restaurantId}`,
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

// ----------- ADMIN -----------

export const adminGetUsers = async (
  handlers: ApiHandlers = {}
): Promise<ApiResponse<UserDTO[]> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<UserDTO[]>>(
    "/api/admin/users",
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

export const adminGetItems = async (
  handlers: ApiHandlers = {}
): Promise<ApiResponse<ItemDTO[]> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<ItemDTO[]>>(
    "/api/admin/items",
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

export const adminBlockUser = async (
  userId: string,
  handlers: ApiHandlers = {}
): Promise<ApiResponse<UserDTO> | null> => {
  const {
    setLoading = () => {},
    onError = defaultOnError,
    onSuccess = (data) => console.log("Success:", data),
    finallyCallback
  } = handlers;

  const result = await apiRequest<ApiResponse<UserDTO>>(
    `/api/admin/users/${userId}/block`,
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
