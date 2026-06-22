export type DailyNegotiationListItem = {
  id: number;
  companyId: number;
  operationDate: string;
  status: string;
  grandTotalCop: number | null;
  lineCount: number;
  createdAt: string;
};

export type NegotiationLine = {
  id: number;
  dailyNegotiationId: number;
  lineNumber: number;
  platformId: number | null;
  platformName: string | null;
  side: string | null;
  otcCounterpartyId: number | null;
  otcCounterpartyCode: string | null;
  commercialRepId: number | null;
  commercialRepInitials: string | null;
  orderer: string | null;
  quantityUsdt: number | null;
  spotRate: string | null;
  netRate: string | null;
  subtotalCop: number | null;
  externalNegotiationId: string | null;
  totalCop: number | null;
  loadReference: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

export type NegotiationRateScenario = {
  id: number;
  dailyNegotiationId: number;
  name: string;
  costPercent: string | null;
  spread: number | null;
  cobreRate: number | null;
  closingRate: number | null;
  sortOrder: number;
};

export type NegotiationDailyQuota = {
  id: number;
  dailyNegotiationId: number;
  commercialRepId: number;
  commercialRepInitials: string;
  commercialRepName: string;
  otcCounterpartyId: number;
  otcCounterpartyCode: string;
  quotaAmount: number;
  maxDailyAmount: number;
  differenceAmount: number;
  status: string;
};

export type DailyNegotiationDetail = {
  id: number;
  companyId: number;
  operationDate: string;
  spotSeticapRate: number | null;
  bollekReference: string | null;
  totalCobreCp: number | null;
  totalCobreV3: number | null;
  totalBitso: number | null;
  totalFinity: number | null;
  grandTotalCop: number | null;
  status: string;
  closedByUserId: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  lines: NegotiationLine[];
  rateScenarios: NegotiationRateScenario[];
  dailyQuotas: NegotiationDailyQuota[];
};

export type CreateDailyNegotiationPayload = {
  operationDate: string;
  spotSeticapRate?: number | null;
  bollekReference?: string | null;
  totalCobreCp?: number | null;
  totalCobreV3?: number | null;
  totalBitso?: number | null;
  totalFinity?: number | null;
  grandTotalCop?: number | null;
  companyId?: number | null;
};

export type UpdateDailyNegotiationPayload = {
  spotSeticapRate?: number | null;
  bollekReference?: string | null;
  totalCobreCp?: number | null;
  totalCobreV3?: number | null;
  totalBitso?: number | null;
  totalFinity?: number | null;
  grandTotalCop?: number | null;
};

export type UpsertNegotiationLinePayload = {
  lineNumber: number;
  platformId?: number | null;
  side?: string | null;
  otcCounterpartyId?: number | null;
  commercialRepId?: number | null;
  orderer?: string | null;
  quantityUsdt?: number | null;
  spotRate?: string | null;
  netRate?: string | null;
  subtotalCop?: number | null;
  externalNegotiationId?: string | null;
  totalCop?: number | null;
  loadReference?: string | null;
  status?: string | null;
};

export type UpsertRateScenarioPayload = {
  name: string;
  costPercent?: string | null;
  spread?: number | null;
  cobreRate?: number | null;
  closingRate?: number | null;
  sortOrder?: number;
};

export type CreateQuotaPayload = {
  commercialRepId: number;
  otcCounterpartyId: number;
  quotaAmount: number;
  maxDailyAmount: number;
  differenceAmount?: number;
  status?: string | null;
};

export type UpdateQuotaPayload = {
  quotaAmount: number;
  maxDailyAmount: number;
  differenceAmount: number;
  status: string;
};

export const NEGOTIATION_DAY_STATUSES = ["Abierto", "Cerrado"] as const;
export const NEGOTIATION_LINE_STATUSES = [
  "Pendiente",
  "Confirmado",
  "Cancelado",
] as const;
export const NEGOTIATION_QUOTA_STATUSES = ["ENVIADO", "NUEVO CUPO"] as const;
export const NEGOTIATION_SIDES = ["Compra", "Venta"] as const;

export function isNegotiationDayOpen(status: string) {
  return status === "Abierto";
}
