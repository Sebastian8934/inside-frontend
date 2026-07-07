/**
 * Base URL del API.
 * Vacío (default) = mismo origen vía proxy Next.js (`/api/*` → backend).
 * Override: `NEXT_PUBLIC_API_URL=http://localhost:5033` para llamar al API directo.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
