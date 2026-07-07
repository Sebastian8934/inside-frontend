import { z } from "zod";
import {
  companyId,
  entityId,
  isoDateString,
  nullableNumber,
  nullableString,
} from "@/lib/validation/primitives";

export const inventoryMovementSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  usdtAmount: z.number(),
  purchaseRate: nullableNumber,
  totalCop: nullableNumber,
  movementType: z.string(),
  clientId: z.number().int(),
  clientCode: z.string(),
  clientName: z.string(),
  usesCobre: z.boolean(),
  shipmentNumber: nullableString,
  txHash: nullableString,
  whatsappGroup: nullableString,
  otcCounterpartyId: nullableNumber,
  otcCounterpartyCode: nullableString,
  walletId: nullableNumber,
  walletCode: nullableString,
});

export const inventoryMovementsListSchema = z.array(inventoryMovementSchema);

export const otcSummaryItemSchema = z.object({
  companyId,
  operationDate: isoDateString,
  otcCounterpartyId: entityId,
  otcCounterpartyCode: z.string(),
  otcCounterpartyName: z.string(),
  dispersadoCop: z.number(),
  cobroCop: z.number(),
  utilidadCop: z.number(),
  saldoUsdt: z.number(),
});

export const otcSummaryListSchema = z.array(otcSummaryItemSchema);

export const blockchainTransactionSchema = z.object({
  id: entityId,
  companyId,
  txHash: z.string(),
  amountUsdt: z.number(),
  matchStatus: z.string(),
  usdtInventoryMovementId: nullableNumber,
  movementOperationDate: nullableString,
  movementClientCode: nullableString,
  createdAt: isoDateString,
});

export const blockchainTransactionsListSchema = z.array(
  blockchainTransactionSchema,
);

export const activityLogListItemSchema = z.object({
  id: entityId,
  companyId,
  activityType: z.string(),
  description: z.string(),
  referenceEntity: nullableString,
  referenceId: nullableNumber,
  createdByUserId: nullableString,
  createdAt: isoDateString,
});

export const activityLogsListSchema = z.array(activityLogListItemSchema);

export const usdtLoanSchema = z.object({
  id: entityId,
  companyId,
  clientId: entityId,
  clientCode: z.string(),
  clientName: z.string(),
  lentUsdt: z.number(),
  returnedUsdt: z.number(),
  pendingUsdt: z.number(),
  averageRate: nullableNumber,
  updatedAt: isoDateString,
});

export const usdtLoansListSchema = z.array(usdtLoanSchema);

export const deliveryMovementListItemSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  clientId: entityId,
  clientCode: z.string(),
  clientName: z.string(),
  movementType: z.string(),
  concept: z.string(),
  totalCop: z.number(),
  comment: nullableString,
  referenceKey: z.string(),
  createdAt: isoDateString,
});

export const deliveryMovementDetailSchema =
  deliveryMovementListItemSchema.extend({
    createdByUserId: nullableString,
    updatedAt: nullableString,
  });

export const deliveryMovementsListSchema = z.array(
  deliveryMovementListItemSchema,
);

export const deliveryClientSummarySchema = z.object({
  companyId,
  clientId: entityId,
  clientCode: z.string(),
  porPagarTotal: z.number(),
  pagadoTotal: z.number(),
  saldoPriorYear: z.number(),
  porPagarCurrentYear: z.number(),
  pagadoCurrentYear: z.number(),
  saldoCurrentYear: z.number(),
  saldoTotal: z.number(),
});

export const deliveryClientSummaryListSchema = z.array(
  deliveryClientSummarySchema,
);
