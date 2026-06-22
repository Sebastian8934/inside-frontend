"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCashOutExpenseApi,
  createPayrollEntryApi,
  createTransactionCostApi,
  deleteCashOutExpenseApi,
  deletePayrollEntryApi,
  deleteTransactionCostApi,
  markCashOutExpenseReviewedApi,
  updateCashOutExpenseApi,
  updatePayrollEntryApi,
  updateTransactionCostApi,
} from "@/components/features/cash-out/api/cash-out.api";
import type { CashOutExpenseFormValues } from "@/components/features/cash-out/schemas/cash-out-expense.schema";
import type { CashOutPayrollFormValues } from "@/components/features/cash-out/schemas/cash-out-payroll.schema";
import type { CashOutTransactionCostFormValues } from "@/components/features/cash-out/schemas/cash-out-transaction-cost.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";

export function useCashOutMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidateCashOut = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.cashOut.root });
  };

  const invalidateDashboard = () => {
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const createExpenseMutation = useMutation({
    mutationFn: (values: CashOutExpenseFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createCashOutExpenseApi({
        ...toExpensePayload(values),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Egreso registrado.");
      invalidateCashOut();
      invalidateDashboard();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: CashOutExpenseFormValues;
    }) => updateCashOutExpenseApi(id, toExpensePayload(values), companyId),
    onSuccess: () => {
      toast.success("Egreso actualizado.");
      invalidateCashOut();
      invalidateDashboard();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) => deleteCashOutExpenseApi(id, companyId),
    onSuccess: () => {
      toast.success("Egreso eliminado.");
      invalidateCashOut();
      invalidateDashboard();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const reviewExpenseMutation = useMutation({
    mutationFn: (id: number) => markCashOutExpenseReviewedApi(id, companyId),
    onSuccess: () => {
      toast.success("Egreso marcado como revisado.");
      invalidateCashOut();
      invalidateDashboard();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const createPayrollMutation = useMutation({
    mutationFn: (values: CashOutPayrollFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createPayrollEntryApi({
        ...toPayrollPayload(values),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Registro de nómina creado.");
      invalidateCashOut();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updatePayrollMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: CashOutPayrollFormValues;
    }) => updatePayrollEntryApi(id, toPayrollPayload(values), companyId),
    onSuccess: () => {
      toast.success("Nómina actualizada.");
      invalidateCashOut();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deletePayrollMutation = useMutation({
    mutationFn: (id: number) => deletePayrollEntryApi(id, companyId),
    onSuccess: () => {
      toast.success("Registro de nómina eliminado.");
      invalidateCashOut();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const createTransactionCostMutation = useMutation({
    mutationFn: (values: CashOutTransactionCostFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createTransactionCostApi({
        ...toTransactionCostPayload(values),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Costo registrado.");
      invalidateCashOut();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateTransactionCostMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: CashOutTransactionCostFormValues;
    }) =>
      updateTransactionCostApi(id, toTransactionCostPayload(values), companyId),
    onSuccess: () => {
      toast.success("Costo actualizado.");
      invalidateCashOut();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteTransactionCostMutation = useMutation({
    mutationFn: (id: number) => deleteTransactionCostApi(id, companyId),
    onSuccess: () => {
      toast.success("Costo eliminado.");
      invalidateCashOut();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createExpense: createExpenseMutation,
    updateExpense: updateExpenseMutation,
    deleteExpense: deleteExpenseMutation,
    reviewExpense: reviewExpenseMutation,
    createPayroll: createPayrollMutation,
    updatePayroll: updatePayrollMutation,
    deletePayroll: deletePayrollMutation,
    createTransactionCost: createTransactionCostMutation,
    updateTransactionCost: updateTransactionCostMutation,
    deleteTransactionCost: deleteTransactionCostMutation,
    isExpensePending:
      createExpenseMutation.isPending || updateExpenseMutation.isPending,
    isPayrollPending:
      createPayrollMutation.isPending || updatePayrollMutation.isPending,
    isTransactionCostPending:
      createTransactionCostMutation.isPending ||
      updateTransactionCostMutation.isPending,
  };
}

function toExpensePayload(values: CashOutExpenseFormValues) {
  return {
    expenseDate: values.expenseDate,
    groupId: values.groupId,
    conceptId: values.conceptId,
    paymentAccountId: values.paymentAccountId,
    description: values.description,
    amountCop: values.amountCop,
    expenseType: values.expenseType?.trim() || null,
  };
}

function toPayrollPayload(values: CashOutPayrollFormValues) {
  return {
    periodMonth: values.periodMonth,
    periodYear: values.periodYear,
    employeeName: values.employeeName,
    jobTitle: values.jobTitle,
    baseSalaryCop: values.baseSalaryCop,
    bonusCop: values.bonusCop,
  };
}

function toTransactionCostPayload(values: CashOutTransactionCostFormValues) {
  return {
    costDate: values.costDate,
    operationalGroup: values.operationalGroup?.trim() || null,
    description: values.description?.trim() || null,
    amountCop: values.amountCop,
    costPercentage: values.costPercentage,
    comment: values.comment?.trim() || null,
  };
}
