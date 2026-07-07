import type { z } from "zod";
import { ApiError } from "@/lib/api/errors";

function formatZodIssues(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(" ");
}

export function parseApiData<T>(
  schema: z.ZodType<T>,
  data: unknown,
  fallbackMessage = "Respuesta del servidor inválida.",
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const detail = formatZodIssues(result.error);
    throw new ApiError(
      detail ? `${fallbackMessage} ${detail}`.trim() : fallbackMessage,
      500,
    );
  }

  return result.data;
}
