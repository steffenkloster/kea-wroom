import { ApiHandlers, apiRequest, ApiResponse } from "../apiRequest";
import { defaultOnError } from "../errorHandlers";

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
    "/api/restaurants/items",
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
