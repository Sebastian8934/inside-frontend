import { z } from "zod";

export const clientSchema = z.object({
  code: z.string().min(1, "El código es requerido").max(50),
  correctedName: z.string().min(1, "El nombre es requerido").max(200),
  isActive: z.boolean().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export const clientDefaultValues: ClientFormValues = {
  code: "",
  correctedName: "",
  isActive: true,
};

export function clientToFormValues(client: {
  code: string;
  correctedName: string;
  isActive: boolean;
}): ClientFormValues {
  return {
    code: client.code,
    correctedName: client.correctedName,
    isActive: client.isActive,
  };
}
