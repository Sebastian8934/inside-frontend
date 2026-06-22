import { z } from "zod";

/** Alineado con la política de contraseñas de ASP.NET Core Identity en insideBack. */
export const identityPasswordHint =
  "Mínimo 8 caracteres, con mayúscula, minúscula y un dígito.";

export const identityPasswordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula.")
  .regex(/[a-z]/, "La contraseña debe tener al menos una minúscula.")
  .regex(/[0-9]/, "La contraseña debe tener al menos un dígito.");
