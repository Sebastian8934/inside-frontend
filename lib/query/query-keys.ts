export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  companies: {
    all: ["companies"] as const,
    context: ["companies", "context"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
  },
  roles: {
    all: ["roles"] as const,
  },
  clients: {
    all: (filters?: Record<string, unknown>) => ["clients", filters] as const,
    detail: (id: number) => ["clients", id] as const,
  },
  wallets: {
    all: (filters?: Record<string, unknown>) => ["wallets", filters] as const,
    detail: (id: number) => ["wallets", id] as const,
  },
  otcCounterparties: {
    all: (filters?: Record<string, unknown>) =>
      ["otc-counterparties", filters] as const,
    detail: (id: number) => ["otc-counterparties", id] as const,
  },
  inventory: {
    root: ["inventory"] as const,
    movements: (filters?: Record<string, unknown>) =>
      ["inventory", "movements", filters] as const,
    movement: (id: number) => ["inventory", "movements", id] as const,
    otcSummary: (filters?: Record<string, unknown>) =>
      ["inventory", "otc-summary", filters] as const,
    movementsCatalog: {
      clients: (companyId?: number | null) =>
        ["inventory", "movements-catalog", "clients", companyId] as const,
      wallets: (companyId?: number | null) =>
        ["inventory", "movements-catalog", "wallets", companyId] as const,
      counterparties: (companyId?: number | null) =>
        ["inventory", "movements-catalog", "counterparties", companyId] as const,
    },
  },
  blockchain: {
    root: ["blockchain"] as const,
    transactions: (filters?: Record<string, unknown>) =>
      ["blockchain", "transactions", filters] as const,
    transaction: (id: number) => ["blockchain", "transactions", id] as const,
  },
  withdrawals: {
    root: ["withdrawals"] as const,
    companies: (filters?: Record<string, unknown>) =>
      ["withdrawals", "companies", filters] as const,
    days: (filters?: Record<string, unknown>) =>
      ["withdrawals", "days", filters] as const,
    day: (id: number) => ["withdrawals", "days", id] as const,
    consolidated: (filters?: Record<string, unknown>) =>
      ["withdrawals", "consolidated", filters] as const,
  },
  usdtLoans: {
    all: (filters?: Record<string, unknown>) =>
      ["usdt-loans", filters] as const,
    detail: (id: number) => ["usdt-loans", id] as const,
  },
  dashboard: {
    all: (filters?: Record<string, unknown>) =>
      ["dashboard", filters] as const,
    summary: (filters?: Record<string, unknown>) =>
      ["dashboard", "summary", filters] as const,
  },
  negotiations: {
    root: ["negotiations"] as const,
    days: (filters?: Record<string, unknown>) =>
      ["negotiations", "days", filters] as const,
    day: (id: number) => ["negotiations", "days", id] as const,
    catalog: {
      platforms: (companyId?: number | null) =>
        ["negotiations", "catalog", "platforms", companyId] as const,
      commercialReps: (companyId?: number | null) =>
        ["negotiations", "catalog", "commercial-reps", companyId] as const,
      counterparties: (companyId?: number | null) =>
        ["negotiations", "catalog", "counterparties", companyId] as const,
    },
  },
  platforms: {
    all: (filters?: Record<string, unknown>) =>
      ["platforms", filters] as const,
  },
  commercialReps: {
    all: (filters?: Record<string, unknown>) =>
      ["commercial-reps", filters] as const,
  },
  delivery: {
    movements: (filters?: Record<string, unknown>) =>
      ["delivery", "movements", filters] as const,
    movement: (id: number) => ["delivery", "movements", id] as const,
    clientSummary: (filters?: Record<string, unknown>) =>
      ["delivery", "client-summary", filters] as const,
  },
  liquidity: {
    root: ["liquidity"] as const,
    closes: (filters?: Record<string, unknown>) =>
      ["liquidity", "closes", filters] as const,
    close: (id: number) => ["liquidity", "closes", id] as const,
  },
  banking: {
    accountHolders: (filters?: Record<string, unknown>) =>
      ["banking", "account-holders", filters] as const,
    movements: (filters?: Record<string, unknown>) =>
      ["banking", "movements", filters] as const,
    movementSummary: (filters?: Record<string, unknown>) =>
      ["banking", "movement-summary", filters] as const,
  },
  activityLog: {
    all: (filters?: Record<string, unknown>) =>
      ["activity-log", filters] as const,
  },
  clientPortal: {
    context: ["client-portal", "context"] as const,
    deliverySummary: (filters?: Record<string, unknown>) =>
      ["client-portal", "delivery-summary", filters] as const,
    usdtLoans: ["client-portal", "usdt-loans"] as const,
  },
  cashOut: {
    root: ["cash-out"] as const,
    groups: (filters?: Record<string, unknown>) =>
      ["cash-out", "groups", filters] as const,
    concepts: (filters?: Record<string, unknown>) =>
      ["cash-out", "concepts", filters] as const,
    paymentAccounts: (filters?: Record<string, unknown>) =>
      ["cash-out", "payment-accounts", filters] as const,
    expenses: (filters?: Record<string, unknown>) =>
      ["cash-out", "expenses", filters] as const,
    expenseSummary: (filters?: Record<string, unknown>) =>
      ["cash-out", "expense-summary", filters] as const,
    payroll: (filters?: Record<string, unknown>) =>
      ["cash-out", "payroll", filters] as const,
    transactionCosts: (filters?: Record<string, unknown>) =>
      ["cash-out", "transaction-costs", filters] as const,
  },
} as const;
