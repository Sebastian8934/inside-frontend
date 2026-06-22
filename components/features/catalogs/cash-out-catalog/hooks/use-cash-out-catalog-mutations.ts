"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCashOutConcept,
  createCashOutGroup,
  createPaymentAccount,
  updateCashOutConcept,
  updateCashOutGroup,
  updatePaymentAccount,
} from "@/components/features/catalogs/cash-out-catalog/api/cash-out-catalog.api";
import type {
  CashOutConceptFormValues,
  CashOutGroupFormValues,
  PaymentAccountFormValues,
} from "@/components/features/catalogs/cash-out-catalog/schemas/cash-out-catalog.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useCashOutGroupMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["cash-out"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: CashOutGroupFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createCashOutGroup({
        name: values.name.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Grupo creado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: CashOutGroupFormValues;
    }) =>
      updateCashOutGroup(
        id,
        {
          name: values.name.trim(),
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Grupo actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createGroup: createMutation,
    updateGroup: updateMutation,
  };
}

export function useCashOutConceptMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["cash-out"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: CashOutConceptFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createCashOutConcept({
        groupId: values.groupId,
        name: values.name.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Concepto creado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: CashOutConceptFormValues;
    }) =>
      updateCashOutConcept(
        id,
        {
          groupId: values.groupId,
          name: values.name.trim(),
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Concepto actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createConcept: createMutation,
    updateConcept: updateMutation,
  };
}

export function usePaymentAccountMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["cash-out"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: PaymentAccountFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createPaymentAccount({
        name: values.name.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Cuenta creada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: PaymentAccountFormValues;
    }) =>
      updatePaymentAccount(
        id,
        {
          name: values.name.trim(),
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Cuenta actualizada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createAccount: createMutation,
    updateAccount: updateMutation,
  };
}
