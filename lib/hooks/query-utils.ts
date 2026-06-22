import { ApiError } from "@/lib/api/errors";

export function getApiErrorMessage(error: unknown, fallback = "Ocurrió un error inesperado.") {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}
