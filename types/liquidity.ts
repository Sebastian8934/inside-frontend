export type DailyLiquidityCloseListItem = {
  id: number;
  companyId: number;
  operationDate: string;
  status: string;
  saldoInsideCop: number | null;
  positionLineCount: number;
  createdAt: string;
};

export type LiquidityPositionLine = {
  id: number;
  dailyLiquidityCloseId: number;
  category: string;
  concept: string;
  amountCop: number;
  sortOrder: number;
};

export type DailyLiquidityCloseDetail = {
  id: number;
  companyId: number;
  operationDate: string;
  saldoInsideCop: number | null;
  accountsBalanceCop: number | null;
  cashBalanceCop: number | null;
  payablesBalanceCop: number | null;
  pendingDeliveryCop: number | null;
  usdtBalanceCop: number | null;
  status: string;
  closedByUserId: string | null;
  closedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  positionLines: LiquidityPositionLine[];
};

export type CreateDailyLiquidityClosePayload = {
  operationDate: string;
  notes?: string | null;
  companyId?: number | null;
};

export type UpdateDailyLiquidityClosePayload = {
  notes?: string | null;
};

export type UpsertLiquidityPositionLinePayload = {
  category: string;
  concept: string;
  amountCop: number;
  sortOrder?: number;
};

export const LIQUIDITY_CLOSE_STATUSES = ["Borrador", "Cerrado"] as const;

export const LIQUIDITY_POSITION_CATEGORIES = [
  "Efectivo",
  "CxPProveedor",
  "Cargue",
  "Cuenta",
] as const;

export const LIQUIDITY_CATEGORY_LABELS: Record<string, string> = {
  Efectivo: "Efectivo",
  CxPProveedor: "CxP proveedor",
  Cargue: "Cargue USDT",
  Cuenta: "Cuentas",
};

export function isLiquidityCloseDraft(status: string) {
  return status === "Borrador";
}
