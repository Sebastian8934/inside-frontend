import { z } from "zod";

export const platformSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  type: z.string().min(1, "Tipo requerido"),
  isActive: z.boolean().optional(),
});

export type PlatformFormValues = z.infer<typeof platformSchema>;

export const platformDefaultValues: PlatformFormValues = {
  name: "",
  type: "",
  isActive: true,
};

export function platformToFormValues(platform: {
  name: string;
  type: string;
  isActive: boolean;
}): PlatformFormValues {
  return {
    name: platform.name,
    type: platform.type,
    isActive: platform.isActive,
  };
}
