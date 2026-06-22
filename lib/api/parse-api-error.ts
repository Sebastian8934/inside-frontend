import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api";
import { ApiError } from "@/lib/api/errors";

type ValidationProblemDetails = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

function flattenValidationErrors(errors: unknown): string[] {
  if (!errors || typeof errors !== "object") {
    return [];
  }

  return Object.values(errors as Record<string, string[]>)
    .flat()
    .filter((message): message is string => Boolean(message));
}

export function formatApiErrorMessage(
  message: string | undefined,
  errors?: string[],
): string {
  if (errors?.length) {
    return errors.length === 1 ? errors[0] : errors.join(" ");
  }

  return message ?? "Error en la solicitud.";
}

export function parseApiErrorFromAxios(error: AxiosError): ApiError {
  const status = error.response?.status ?? 500;
  const payload = error.response?.data;

  if (payload && typeof payload === "object") {
    if ("success" in payload) {
      const apiPayload = payload as ApiResponse<unknown>;
      const errors = apiPayload.errors ? [...apiPayload.errors] : undefined;

      return new ApiError(
        formatApiErrorMessage(apiPayload.message, errors),
        status,
        errors,
      );
    }

    if ("errors" in payload) {
      const problem = payload as ValidationProblemDetails;
      const errors = flattenValidationErrors(problem.errors);

      return new ApiError(
        formatApiErrorMessage(problem.title ?? problem.detail, errors),
        status,
        errors.length > 0 ? errors : undefined,
      );
    }

    if ("message" in payload && typeof payload.message === "string") {
      return new ApiError(payload.message, status);
    }
  }

  return new ApiError(error.message || "Error de red.", status);
}
