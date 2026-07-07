import { z } from "zod";
import {
  companyId,
  entityId,
  isoDateString,
  nullableNumber,
  nullableString,
  timestampsSchema,
} from "@/lib/validation/primitives";
import { deliveryClientSummarySchema } from "@/lib/validation/operations.schema";
import { usdtLoanSchema } from "@/lib/validation/operations.schema";

export const cashOutGroupSchema = z.object({
  id: entityId,
  companyId,
  name: z.string(),
  isActive: z.boolean(),
});

export const cashOutConceptSchema = z.object({
  id: entityId,
  companyId,
  groupId: entityId,
  groupName: z.string(),
  name: z.string(),
  isActive: z.boolean(),
});

export const paymentAccountSchema = z.object({
  id: entityId,
  companyId,
  name: z.string(),
  isActive: z.boolean(),
});

export const cashOutGroupDetailSchema = cashOutGroupSchema.extend(
  timestampsSchema,
);

export const cashOutConceptDetailSchema = cashOutConceptSchema.extend(
  timestampsSchema,
);

export const paymentAccountDetailSchema = paymentAccountSchema.extend(
  timestampsSchema,
);

export const cashOutGroupsListSchema = z.array(cashOutGroupSchema);
export const cashOutConceptsListSchema = z.array(cashOutConceptSchema);
export const paymentAccountsListSchema = z.array(paymentAccountSchema);

export const cashOutExpenseListItemSchema = z.object({
  id: entityId,
  companyId,
  expenseDate: isoDateString,
  groupId: entityId,
  groupName: z.string(),
  conceptId: entityId,
  conceptName: z.string(),
  description: z.string(),
  paymentAccountId: entityId,
  paymentAccountName: z.string(),
  amountCop: z.number(),
  expenseType: nullableString,
  isReviewed: z.boolean(),
  periodMonth: z.number().int(),
  periodYear: z.number().int(),
  createdAt: isoDateString,
});

export const cashOutExpenseDetailSchema = cashOutExpenseListItemSchema.extend({
  reviewedByUserId: nullableString,
  reviewedAt: nullableString,
  createdByUserId: nullableString,
  updatedAt: nullableString,
});

export const cashOutExpenseSummarySchema = z.object({
  companyId,
  periodMonth: z.number().int(),
  periodYear: z.number().int(),
  totalAmountCop: z.number(),
  unreviewedCount: z.number().int(),
  topConceptName: nullableString,
});

export const cashOutExpensesListSchema = z.array(cashOutExpenseListItemSchema);

export const payrollEntrySchema = z.object({
  id: entityId,
  companyId,
  periodMonth: z.number().int(),
  periodYear: z.number().int(),
  employeeName: z.string(),
  jobTitle: z.string(),
  baseSalaryCop: z.number(),
  bonusCop: z.number(),
  totalCop: z.number(),
  createdAt: isoDateString,
});

export const payrollEntriesListSchema = z.array(payrollEntrySchema);

export const cashOutTransactionCostSchema = z.object({
  id: entityId,
  companyId,
  costDate: isoDateString,
  operationalGroup: nullableString,
  description: nullableString,
  amountCop: nullableNumber,
  costPercentage: nullableNumber,
  comment: nullableString,
  createdAt: isoDateString,
});

export const cashOutTransactionCostsListSchema = z.array(
  cashOutTransactionCostSchema,
);

export const liquidityPositionLineSchema = z.object({
  id: entityId,
  dailyLiquidityCloseId: entityId,
  category: z.string(),
  concept: z.string(),
  amountCop: z.number(),
  sortOrder: z.number().int(),
});

export const dailyLiquidityCloseListItemSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  status: z.string(),
  saldoInsideCop: nullableNumber,
  positionLineCount: z.number().int(),
  createdAt: isoDateString,
});

export const dailyLiquidityCloseDetailSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  saldoInsideCop: nullableNumber,
  accountsBalanceCop: nullableNumber,
  cashBalanceCop: nullableNumber,
  payablesBalanceCop: nullableNumber,
  pendingDeliveryCop: nullableNumber,
  usdtBalanceCop: nullableNumber,
  status: z.string(),
  closedByUserId: nullableString,
  closedAt: nullableString,
  notes: nullableString,
  createdAt: isoDateString,
  updatedAt: nullableString,
  positionLines: z.array(liquidityPositionLineSchema),
});

export const dailyLiquidityClosesListSchema = z.array(
  dailyLiquidityCloseListItemSchema,
);

export const negotiationLineSchema = z.object({
  id: entityId,
  dailyNegotiationId: entityId,
  lineNumber: z.number().int(),
  platformId: nullableNumber,
  platformName: nullableString,
  side: nullableString,
  otcCounterpartyId: nullableNumber,
  otcCounterpartyCode: nullableString,
  commercialRepId: nullableNumber,
  commercialRepInitials: nullableString,
  orderer: nullableString,
  quantityUsdt: nullableNumber,
  spotRate: nullableString,
  netRate: nullableString,
  subtotalCop: nullableNumber,
  externalNegotiationId: nullableString,
  totalCop: nullableNumber,
  loadReference: nullableString,
  status: z.string(),
  createdAt: isoDateString,
  updatedAt: nullableString,
});

export const negotiationRateScenarioSchema = z.object({
  id: entityId,
  dailyNegotiationId: entityId,
  name: z.string(),
  costPercent: nullableString,
  spread: nullableNumber,
  cobreRate: nullableNumber,
  closingRate: nullableNumber,
  sortOrder: z.number().int(),
});

export const negotiationDailyQuotaSchema = z.object({
  id: entityId,
  dailyNegotiationId: entityId,
  commercialRepId: entityId,
  commercialRepInitials: z.string(),
  commercialRepName: z.string(),
  otcCounterpartyId: entityId,
  otcCounterpartyCode: z.string(),
  quotaAmount: z.number(),
  maxDailyAmount: z.number(),
  differenceAmount: z.number(),
  status: z.string(),
});

export const dailyNegotiationListItemSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  status: z.string(),
  grandTotalCop: nullableNumber,
  lineCount: z.number().int(),
  createdAt: isoDateString,
});

export const dailyNegotiationDetailSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  spotSeticapRate: nullableNumber,
  bollekReference: nullableString,
  totalCobreCp: nullableNumber,
  totalCobreV3: nullableNumber,
  totalBitso: nullableNumber,
  totalFinity: nullableNumber,
  grandTotalCop: nullableNumber,
  status: z.string(),
  closedByUserId: nullableString,
  closedAt: nullableString,
  createdAt: isoDateString,
  updatedAt: nullableString,
  lines: z.array(negotiationLineSchema),
  rateScenarios: z.array(negotiationRateScenarioSchema),
  dailyQuotas: z.array(negotiationDailyQuotaSchema),
});

export const dailyNegotiationsListSchema = z.array(
  dailyNegotiationListItemSchema,
);

export const withdrawalCompanySchema = z.object({
  id: entityId,
  companyId,
  name: z.string(),
  isActive: z.boolean(),
});

export const withdrawalCompanyDetailSchema =
  withdrawalCompanySchema.extend(timestampsSchema);

export const withdrawalCompaniesListSchema = z.array(withdrawalCompanySchema);

export const withdrawalSlotSchema = z.object({
  slotIndex: z.number().int(),
  amountCop: z.number(),
  isActive: z.boolean(),
});

export const withdrawalCompanyLineSchema = z.object({
  withdrawalCompanyId: entityId,
  withdrawalCompanyName: z.string(),
  clientId: nullableNumber,
  clientCode: nullableString,
  slots: z.array(withdrawalSlotSchema),
  totalCop: z.number(),
});

export const withdrawalTransferSchema = z.object({
  id: entityId,
  withdrawalCompanyId: entityId,
  withdrawalCompanyName: z.string(),
  amountCop: z.number(),
  transferType: z.string(),
});

export const withdrawalDayListItemSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  totalWithdrawalsCop: z.number(),
  totalTransfersCop: z.number(),
  lineCount: z.number().int(),
  transferCount: z.number().int(),
  createdAt: isoDateString,
});

export const withdrawalDayDetailSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  totalWithdrawalsCop: z.number(),
  totalTransfersCop: z.number(),
  createdAt: isoDateString,
  updatedAt: nullableString,
  companyLines: z.array(withdrawalCompanyLineSchema),
  transfers: z.array(withdrawalTransferSchema),
});

export const withdrawalDaysListSchema = z.array(withdrawalDayListItemSchema);

export const withdrawalConsolidatedItemSchema = z.object({
  id: entityId,
  companyId,
  operationDate: isoDateString,
  withdrawalCompanyId: entityId,
  withdrawalCompanyName: z.string(),
  amountCop: z.number(),
  holding: nullableString,
  periodMonth: z.number().int(),
  periodYear: z.number().int(),
});

export const withdrawalConsolidatedListSchema = z.array(
  withdrawalConsolidatedItemSchema,
);

export const clientPortalDeliverySummaryListSchema = z.array(
  deliveryClientSummarySchema,
);

export const clientPortalUsdtLoansListSchema = z.array(usdtLoanSchema);
