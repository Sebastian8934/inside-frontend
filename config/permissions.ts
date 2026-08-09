/** Códigos de permiso alineados a ApplicationPermissions / seed SQL. */
export const PERMISSION_CODES = {
  DashboardView: "Dashboard.View",

  InventoryView: "Inventory.View",
  InventoryCreate: "Inventory.Create",
  InventoryEdit: "Inventory.Edit",
  InventoryDelete: "Inventory.Delete",

  NegotiationsView: "Negotiations.View",
  NegotiationsCreate: "Negotiations.Create",
  NegotiationsEdit: "Negotiations.Edit",
  NegotiationsDelete: "Negotiations.Delete",

  LiquidityView: "Liquidity.View",
  LiquidityCreate: "Liquidity.Create",
  LiquidityEdit: "Liquidity.Edit",
  LiquidityDelete: "Liquidity.Delete",

  DeliveryView: "Delivery.View",
  DeliveryCreate: "Delivery.Create",
  DeliveryEdit: "Delivery.Edit",
  DeliveryDelete: "Delivery.Delete",

  UsdtLoansView: "UsdtLoans.View",
  UsdtLoansCreate: "UsdtLoans.Create",
  UsdtLoansEdit: "UsdtLoans.Edit",
  UsdtLoansDelete: "UsdtLoans.Delete",

  CashOutView: "CashOut.View",
  CashOutCreate: "CashOut.Create",
  CashOutEdit: "CashOut.Edit",
  CashOutDelete: "CashOut.Delete",

  WithdrawalsView: "Withdrawals.View",
  WithdrawalsCreate: "Withdrawals.Create",
  WithdrawalsEdit: "Withdrawals.Edit",
  WithdrawalsDelete: "Withdrawals.Delete",

  BankingView: "Banking.View",
  BankingCreate: "Banking.Create",
  BankingEdit: "Banking.Edit",
  BankingDelete: "Banking.Delete",

  ReportsView: "Reports.View",

  CatalogsView: "Catalogs.View",
  CatalogsManage: "Catalogs.Manage",
  CatalogsCreate: "Catalogs.Create",
  CatalogsEdit: "Catalogs.Edit",

  AdministrationView: "Administration.View",
  AdministrationManage: "Administration.Manage",

  ActivityLogView: "ActivityLog.View",
  ActivityLogCreate: "ActivityLog.Create",
} as const;

export type PermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];
