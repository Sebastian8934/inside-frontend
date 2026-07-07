import type { AxiosRequestConfig } from "axios";
import type { z } from "zod";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  axiosPut,
} from "@/lib/axios/client";
import { parseApiData } from "@/lib/validation/parse-api-data";

export async function axiosGetValidated<T>(
  url: string,
  schema: z.ZodType<T>,
  config?: AxiosRequestConfig,
  errorMessage = "Respuesta del servidor inválida.",
): Promise<T> {
  const data = await axiosGet<unknown>(url, config);
  return parseApiData(schema, data, errorMessage);
}

export async function axiosPostValidated<T>(
  url: string,
  schema: z.ZodType<T>,
  body?: unknown,
  config?: AxiosRequestConfig,
  errorMessage = "Respuesta del servidor inválida.",
): Promise<T> {
  const data = await axiosPost<unknown>(url, body, config);
  return parseApiData(schema, data, errorMessage);
}

export async function axiosPutValidated<T>(
  url: string,
  schema: z.ZodType<T>,
  body?: unknown,
  config?: AxiosRequestConfig,
  errorMessage = "Respuesta del servidor inválida.",
): Promise<T> {
  const data = await axiosPut<unknown>(url, body, config);
  return parseApiData(schema, data, errorMessage);
}

export async function axiosPatchValidated<T>(
  url: string,
  schema: z.ZodType<T>,
  body?: unknown,
  config?: AxiosRequestConfig,
  errorMessage = "Respuesta del servidor inválida.",
): Promise<T> {
  const data = await axiosPatch<unknown>(url, body, config);
  return parseApiData(schema, data, errorMessage);
}

export async function axiosDeleteValidated<T>(
  url: string,
  schema: z.ZodType<T>,
  config?: AxiosRequestConfig,
  errorMessage = "Respuesta del servidor inválida.",
): Promise<T> {
  const data = await axiosDelete<unknown>(url, config);
  return parseApiData(schema, data, errorMessage);
}
