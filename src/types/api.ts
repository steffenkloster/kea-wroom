export interface ApiHandlers<T = unknown> {
  setLoading?: (isLoading: boolean) => void;
  onError?: (error: { statusCode: number; error: string }) => void;
  onSuccess?: (data: T) => void; // Generic to handle specific success data
  finallyCallback?: () => void;
}
