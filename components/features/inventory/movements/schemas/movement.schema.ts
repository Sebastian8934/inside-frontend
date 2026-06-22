import { z } from "zod";

export const movementSchema = z.object({
  operationDate: z.string().min(1, "La fecha es requerida"),
  usdtAmount: z
    .number({ error: "USDT requerido" })
    .refine((v) => v !== 0, "USDT no puede ser 0"),
  movementType: z.enum(["Efectivo", "Cuenta"]),
  clientId: z.number().positive("Seleccione un cliente"),
  purchaseRate: z.number().nullable().optional(),
  totalCop: z.number().nullable().optional(),
  usesCobre: z.boolean(),
  shipmentNumber: z.string().nullable().optional(),
  txHash: z.string().nullable().optional(),
  whatsappGroup: z.string().nullable().optional(),
  otcCounterpartyId: z.number().nullable().optional(),
  walletId: z.number().nullable().optional(),
});

export type MovementFormValues = z.infer<typeof movementSchema>;

export const movementDefaultValues: MovementFormValues = {
  operationDate: "",
  usdtAmount: 0,
  movementType: "Cuenta",
  clientId: 0,
  usesCobre: false,
};

export function movementToFormValues(
  movement: {
    operationDate: string;
    usdtAmount: number;
    movementType: string;
    clientId: number;
    purchaseRate?: number | null;
    totalCop?: number | null;
    usesCobre: boolean;
    shipmentNumber?: string | null;
    txHash?: string | null;
    whatsappGroup?: string | null;
    otcCounterpartyId?: number | null;
    walletId?: number | null;
  },
  defaultDate: string,
): MovementFormValues {
  return {
    operationDate: movement.operationDate ?? defaultDate,
    usdtAmount: movement.usdtAmount ?? 0,
    movementType: movement.movementType as MovementFormValues["movementType"],
    clientId: movement.clientId ?? 0,
    purchaseRate: movement.purchaseRate ?? undefined,
    totalCop: movement.totalCop ?? undefined,
    usesCobre: movement.usesCobre ?? false,
    shipmentNumber: movement.shipmentNumber ?? "",
    txHash: movement.txHash ?? "",
    whatsappGroup: movement.whatsappGroup ?? "",
    otcCounterpartyId: movement.otcCounterpartyId ?? undefined,
    walletId: movement.walletId ?? undefined,
  };
}
