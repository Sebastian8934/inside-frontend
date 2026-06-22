import type { DeliveryClientSummary } from "@/types/delivery";
import type { UsdtLoan } from "@/types/usdt-loans";

export type ClientPortalContext = {
  userId: string;
  role: string;
  activeCompanyId: number | null;
  clientId: number;
};

export type ClientPortalDeliverySummary = DeliveryClientSummary;
export type ClientPortalUsdtLoan = UsdtLoan;
