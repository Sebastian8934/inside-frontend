import { z } from "zod";
import {
  companyId,
  entityId,
  isoDateString,
  nullableNumber,
  nullableString,
  timestampsSchema,
} from "@/lib/validation/primitives";

export const dashboardSummarySchema = z.object({
  companyId,
  operationDate: isoDateString,
  saldoInsideCop: nullableNumber,
  hasLiquidityClose: z.boolean(),
  liquidityCloseStatus: nullableString,
  usdtNetToday: z.number(),
  inventoryMovementCountToday: z.number().int(),
  inventoryCopTotalToday: z.number(),
  negotiatedCopToday: nullableNumber,
  negotiationLineCountToday: z.number().int(),
  hasNegotiationDay: z.boolean(),
  negotiationDayStatus: nullableString,
  pendingDeliveryCop: z.number(),
  deliveryClientsWithBalance: z.number().int(),
  cashOutMonthCop: z.number(),
  cashOutUnreviewedMonth: z.number().int(),
  unmatchedBlockchainCount: z.number().int(),
  openLiquidityDaysCount: z.number().int(),
});

export const recentActivityItemSchema = z.object({
  activityType: z.string(),
  description: z.string(),
  occurredAt: isoDateString,
  status: nullableString,
});

export const dashboardTopDeliveryClientSchema = z.object({
  clientId: entityId,
  clientCode: z.string(),
  saldoTotal: z.number(),
});

export const dashboardDataSchema = z.object({
  summary: dashboardSummarySchema,
  recentActivity: z.array(recentActivityItemSchema),
  topDeliveryClients: z.array(dashboardTopDeliveryClientSchema),
});

export const clientPortalContextSchema = z.object({
  userId: z.string().min(1),
  role: z.string().min(1),
  activeCompanyId: z.number().int().positive().nullable(),
  clientId: entityId,
});
