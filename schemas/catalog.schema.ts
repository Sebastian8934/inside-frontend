import { z } from "zod";

export {
  clientSchema,
  type ClientFormValues,
} from "@/components/features/catalogs/clients/schemas/client.schema";

export {
  movementSchema,
  type MovementFormValues,
} from "@/components/features/inventory/movements/schemas/movement.schema";

export const blockchainSchema = z.object({
  txHash: z.string().min(1, "El hash es requerido"),
  amountUsdt: z.coerce.number().refine((v) => v !== 0, "Monto USDT requerido"),
});

export type BlockchainFormValues = z.infer<typeof blockchainSchema>;

export {
  userSchema,
  editUserSchema,
  type UserFormValues,
  type EditUserFormValues,
} from "@/components/features/users/schemas/user.schema";
