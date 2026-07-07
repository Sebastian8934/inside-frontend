export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  companies: {
    list: "/api/companies",
    context: "/api/companies/context",
  },
  users: {
    list: "/api/users",
    detail: (id: string) => `/api/users/${id}`,
  },
  roles: {
    list: "/api/roles",
  },
  clients: {
    list: "/api/clients",
    detail: (id: number) => `/api/clients/${id}`,
  },
  wallets: {
    list: "/api/wallets",
    detail: (id: number) => `/api/wallets/${id}`,
  },
  otcCounterparties: {
    list: "/api/otc-counterparties",
    detail: (id: number) => `/api/otc-counterparties/${id}`,
  },
  inventory: {
    movements: "/api/inventory/movements",
    movement: (id: number) => `/api/inventory/movements/${id}`,
    otcSummary: "/api/inventory/otc-summary",
  },
  blockchain: {
    transactions: "/api/blockchain/transactions",
    transaction: (id: number) => `/api/blockchain/transactions/${id}`,
    match: (id: number) => `/api/blockchain/transactions/${id}/match`,
    unmatch: (id: number) => `/api/blockchain/transactions/${id}/unmatch`,
  },
  withdrawals: {
    companies: "/api/withdrawals/companies",
    company: (id: number) => `/api/withdrawals/companies/${id}`,
    days: "/api/withdrawals/days",
    day: (id: number) => `/api/withdrawals/days/${id}`,
    companyLines: (dayId: number) =>
      `/api/withdrawals/days/${dayId}/company-lines`,
    dayTransfers: (dayId: number) =>
      `/api/withdrawals/days/${dayId}/transfers`,
    transfer: (id: number) => `/api/withdrawals/transfers/${id}`,
    consolidated: "/api/withdrawals/consolidated",
    consolidatedItem: (id: number) => `/api/withdrawals/consolidated/${id}`,
  },
  usdtLoans: {
    list: "/api/usdt-loans",
    detail: (id: number) => `/api/usdt-loans/${id}`,
  },
  dashboard: {
    root: "/api/dashboard",
    summary: "/api/dashboard/summary",
  },
  negotiations: {
    days: "/api/negotiations/days",
    day: (id: number) => `/api/negotiations/days/${id}`,
    closeDay: (id: number) => `/api/negotiations/days/${id}/close`,
    lines: (dayId: number) => `/api/negotiations/days/${dayId}/lines`,
    line: (lineId: number) => `/api/negotiations/lines/${lineId}`,
    rateScenarios: (dayId: number) =>
      `/api/negotiations/days/${dayId}/rate-scenarios`,
    rateScenario: (id: number) => `/api/negotiations/rate-scenarios/${id}`,
    quotas: (dayId: number) => `/api/negotiations/days/${dayId}/quotas`,
    quota: (id: number) => `/api/negotiations/quotas/${id}`,
  },
  platforms: {
    list: "/api/platforms",
    detail: (id: number) => `/api/platforms/${id}`,
  },
  commercialReps: {
    list: "/api/commercial-reps",
    detail: (id: number) => `/api/commercial-reps/${id}`,
  },
  delivery: {
    movements: "/api/delivery/movements",
    movement: (id: number) => `/api/delivery/movements/${id}`,
    clientSummary: "/api/delivery/client-summary",
  },
  liquidity: {
    closes: "/api/liquidity/closes",
    close: (id: number) => `/api/liquidity/closes/${id}`,
    closeDay: (id: number) => `/api/liquidity/closes/${id}/close`,
    refreshDelivery: (id: number) =>
      `/api/liquidity/closes/${id}/refresh-delivery`,
    refreshSources: (id: number) =>
      `/api/liquidity/closes/${id}/refresh-sources`,
    lines: (closeId: number) => `/api/liquidity/closes/${closeId}/lines`,
    line: (lineId: number) => `/api/liquidity/lines/${lineId}`,
  },
  banking: {
    accountHolders: "/api/banking/account-holders",
    accountHolder: (id: number) => `/api/banking/account-holders/${id}`,
    movements: "/api/banking/movements",
    movement: (id: number) => `/api/banking/movements/${id}`,
    movementSummary: "/api/banking/movements/summary",
  },
  activityLog: {
    list: "/api/activity-log",
  },
  clientPortal: {
    context: "/api/client-portal/context",
    deliverySummary: "/api/client-portal/delivery-summary",
    usdtLoans: "/api/client-portal/usdt-loans",
  },
  cashOut: {
    groups: "/api/cash-out/groups",
    group: (id: number) => `/api/cash-out/groups/${id}`,
    concepts: "/api/cash-out/concepts",
    concept: (id: number) => `/api/cash-out/concepts/${id}`,
    paymentAccounts: "/api/cash-out/payment-accounts",
    paymentAccount: (id: number) => `/api/cash-out/payment-accounts/${id}`,
    expenses: "/api/cash-out/expenses",
    expenseSummary: "/api/cash-out/expenses/summary",
    expense: (id: number) => `/api/cash-out/expenses/${id}`,
    reviewExpense: (id: number) => `/api/cash-out/expenses/${id}/review`,
    payroll: "/api/cash-out/payroll",
    payrollEntry: (id: number) => `/api/cash-out/payroll/${id}`,
    transactionCosts: "/api/cash-out/transaction-costs",
    transactionCost: (id: number) => `/api/cash-out/transaction-costs/${id}`,
  },
} as const;
