export type DashboardSummary = {
  companyId: number;
  operationDate: string;
  saldoInsideCop: number | null;
  hasLiquidityClose: boolean;
  liquidityCloseStatus: string | null;
  usdtNetToday: number;
  inventoryMovementCountToday: number;
  inventoryCopTotalToday: number;
  negotiatedCopToday: number | null;
  negotiationLineCountToday: number;
  hasNegotiationDay: boolean;
  negotiationDayStatus: string | null;
  pendingDeliveryCop: number;
  deliveryClientsWithBalance: number;
  cashOutMonthCop: number;
  cashOutUnreviewedMonth: number;
  unmatchedBlockchainCount: number;
  openLiquidityDaysCount: number;
};

export type RecentActivityItem = {
  activityType: string;
  description: string;
  occurredAt: string;
  status: string | null;
};

export type DashboardTopDeliveryClient = {
  clientId: number;
  clientCode: string;
  saldoTotal: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  recentActivity: RecentActivityItem[];
  topDeliveryClients: DashboardTopDeliveryClient[];
};
