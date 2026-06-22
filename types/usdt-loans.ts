export type UsdtLoan = {
  id: number;
  companyId: number;
  clientId: number;
  clientCode: string;
  clientName: string;
  lentUsdt: number;
  returnedUsdt: number;
  pendingUsdt: number;
  averageRate: number | null;
  updatedAt: string;
};

export type UpsertUsdtLoanPayload = {
  clientId: number;
  lentUsdt: number;
  returnedUsdt: number;
  averageRate?: number | null;
  companyId?: number | null;
};

export type UpdateUsdtLoanPayload = {
  lentUsdt: number;
  returnedUsdt: number;
  averageRate?: number | null;
};
