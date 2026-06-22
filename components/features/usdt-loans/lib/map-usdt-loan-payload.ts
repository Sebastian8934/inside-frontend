import type {
  CreateUsdtLoanFormValues,
  UsdtLoanFormValues,
} from "@/components/features/usdt-loans/schemas/usdt-loan.schema";
import type {
  UpdateUsdtLoanPayload,
  UpsertUsdtLoanPayload,
} from "@/types/usdt-loans";

function toLoanPayload(values: UsdtLoanFormValues) {
  return {
    lentUsdt: values.lentUsdt,
    returnedUsdt: values.returnedUsdt,
    averageRate: values.averageRate ?? null,
  };
}

export function toUpsertUsdtLoanPayload(
  values: CreateUsdtLoanFormValues,
  companyId: number,
): UpsertUsdtLoanPayload {
  return {
    ...toLoanPayload(values),
    clientId: values.clientId,
    companyId,
  };
}

export function toUpdateUsdtLoanPayload(
  values: UsdtLoanFormValues,
): UpdateUsdtLoanPayload {
  return toLoanPayload(values);
}
