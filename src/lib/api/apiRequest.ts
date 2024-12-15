import { handleError } from "./errorHandlers";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: BodyInit | null;
}

export interface ApiHandlers<T = unknown> {
  setLoading?: (isLoading: boolean) => void;
  onError?: (error: { statusCode: number; error: string }) => void;
  onSuccess?: (data: T) => void; // Generic to handle specific success data
  finallyCallback?: () => void;
}

export interface ApiResponse<T = undefined> {
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
export const apiRequest = async <T>(
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
