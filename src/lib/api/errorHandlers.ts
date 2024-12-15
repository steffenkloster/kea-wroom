import { toast } from "sonner";

export const defaultOnError = (error: {
  statusCode: number;
  error: string;
}): void => {
  if (error.statusCode.toString().startsWith("4")) {
    toast.error(error.error);
    return;
  }

  toast.error("An error occurred. Please try again later.");
};

export const handleError = (
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
