import { fetchClients } from "@/lib/api/clients";
import {
  fetchUsdtLoans,
  updateUsdtLoan,
  upsertUsdtLoan,
} from "@/lib/api/usdt-loans";

export type { UsdtLoanFilters } from "@/lib/api/usdt-loans";

export {
  fetchUsdtLoans as fetchUsdtLoansApi,
  upsertUsdtLoan as upsertUsdtLoanApi,
  updateUsdtLoan as updateUsdtLoanApi,
  fetchClients as fetchUsdtLoanClientsApi,
};
