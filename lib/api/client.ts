import type { Method } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/api";
import { axiosClient } from "@/lib/axios/client";

export { ApiError } from "@/lib/api/errors";
export { API_BASE_URL } from "@/lib/api/constants";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  skipRefresh?: boolean;
  _retry?: boolean;
  headers?: Record<string, string>;
};

/**
 * Compat wrapper — delega en axios. Preferir axiosGet/Post/Put/Delete de @/lib/axios.
 */
export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, method = "GET", headers, skipRefresh, _retry } = options;

  const response = await axiosClient.request<ApiResponse<T>>({
    url: path,
    method: method as Method,
    data: body,
    headers,
    skipRefresh,
    _retry,
  } as AxiosRequestConfig & { skipRefresh?: boolean; _retry?: boolean });

  return response.data;
}
