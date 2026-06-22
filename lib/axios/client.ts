import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "@/types/api";
import { getAccessToken } from "@/stores/auth-store";
import { tryRefreshSession } from "@/lib/auth/refresh-session";
import { API_BASE_URL } from "@/lib/api/constants";
import { ApiError } from "@/lib/api/errors";
import {
  formatApiErrorMessage,
  parseApiErrorFromAxios,
} from "@/lib/api/parse-api-error";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipRefresh?: boolean;
};

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config: RetryConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>;

    if (payload && typeof payload === "object" && "success" in payload) {
      if (!payload.success) {
        const errors = payload.errors ? [...payload.errors] : undefined;
        throw new ApiError(
          formatApiErrorMessage(payload.message, errors),
          response.status,
          errors,
        );
      }

      response.data = payload;
    }

    return response;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = config?.url ?? "";

    if (
      status === 401 &&
      config &&
      !config._retry &&
      !config.skipRefresh &&
      !url.includes("/api/auth/login") &&
      !url.includes("/api/auth/refresh")
    ) {
      const refreshed = await tryRefreshSession();

      if (refreshed) {
        config._retry = true;
        config.headers.Authorization = `Bearer ${getAccessToken()}`;
        return axiosClient(config);
      }

      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    throw parseApiErrorFromAxios(error);
  },
);

export async function axiosGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await axiosClient.get<ApiResponse<T>>(url, config);
  return response.data.data as T;
}

export async function axiosPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await axiosClient.post<ApiResponse<T>>(url, body, config);
  return response.data.data as T;
}

export async function axiosPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await axiosClient.put<ApiResponse<T>>(url, body, config);
  return response.data.data as T;
}

export async function axiosPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await axiosClient.patch<ApiResponse<T>>(url, body, config);
  return response.data.data as T;
}

export async function axiosDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await axiosClient.delete<ApiResponse<T>>(url, config);
  return response.data.data as T;
}
