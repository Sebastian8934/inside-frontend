import { z } from "zod";

export const blockchainTransactionSchema = z.object({
  txHash: z.string().trim().min(1, "Hash requerido"),
  amountUsdt: z.number().refine((v) => v !== 0, "Monto USDT requerido"),
});

export type BlockchainTransactionFormValues = z.infer<
  typeof blockchainTransactionSchema
>;

export const blockchainTransactionDefaultValues: BlockchainTransactionFormValues =
  {
    txHash: "",
    amountUsdt: 0,
  };

export const blockchainMatchSchema = z.object({
  usdtInventoryMovementId: z.number().positive("ID de movimiento requerido"),
});

export type BlockchainMatchFormValues = z.infer<typeof blockchainMatchSchema>;

export const blockchainMatchDefaultValues: BlockchainMatchFormValues = {
  usdtInventoryMovementId: 0,
};
