"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  closeNegotiationDayApi,
  createNegotiationDayApi,
  createNegotiationLineApi,
  createQuotaApi,
  createRateScenarioApi,
  deleteNegotiationLineApi,
  deleteQuotaApi,
  deleteRateScenarioApi,
  updateNegotiationDayApi,
  updateNegotiationLineApi,
  updateQuotaApi,
  updateRateScenarioApi,
} from "@/components/features/negotiations/api/negotiations.api";
import type { NegotiationDayFormValues } from "@/components/features/negotiations/schemas/negotiation-day.schema";
import type { NegotiationLineFormValues } from "@/components/features/negotiations/schemas/negotiation-line.schema";
import type { NegotiationQuotaFormValues } from "@/components/features/negotiations/schemas/negotiation-quota.schema";
import type { NegotiationScenarioFormValues } from "@/components/features/negotiations/schemas/negotiation-scenario.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";

function invalidateNegotiations(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.negotiations.root });
}

export function useNegotiationDayMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const createDay = useMutation({
    mutationFn: (operationDate: string) => {
      if (!companyId) throw new Error("Empresa no seleccionada.");
      return createNegotiationDayApi({ operationDate, companyId });
    },
    onSuccess: () => {
      toast.success("Día de negociación creado.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateDay = useMutation({
    mutationFn: ({
      dayId,
      values,
    }: {
      dayId: number;
      values: NegotiationDayFormValues;
    }) =>
      updateNegotiationDayApi(
        dayId,
        {
          spotSeticapRate: values.spotSeticapRate ?? null,
          bollekReference: values.bollekReference || null,
          totalCobreCp: values.totalCobreCp ?? null,
          totalCobreV3: values.totalCobreV3 ?? null,
          totalBitso: values.totalBitso ?? null,
          totalFinity: values.totalFinity ?? null,
          grandTotalCop: values.grandTotalCop ?? null,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Negociación actualizada.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const closeDay = useMutation({
    mutationFn: (dayId: number) => closeNegotiationDayApi(dayId, companyId),
    onSuccess: () => {
      toast.success("Día de negociación cerrado.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { createDay, updateDay, closeDay };
}

export function useNegotiationLineMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const saveLine = useMutation({
    mutationFn: ({
      dayId,
      lineId,
      values,
    }: {
      dayId: number;
      lineId?: number;
      values: NegotiationLineFormValues;
    }) => {
      const payload = {
        lineNumber: values.lineNumber,
        platformId: values.platformId ?? null,
        side: values.side ?? null,
        otcCounterpartyId: values.otcCounterpartyId ?? null,
        commercialRepId: values.commercialRepId ?? null,
        orderer: values.orderer || null,
        quantityUsdt: values.quantityUsdt ?? null,
        spotRate: values.spotRate || null,
        netRate: values.netRate || null,
        subtotalCop: values.subtotalCop ?? null,
        totalCop: values.totalCop ?? null,
        externalNegotiationId: values.externalNegotiationId || null,
        loadReference: values.loadReference || null,
        status: values.status,
      };

      if (lineId) {
        return updateNegotiationLineApi(lineId, payload, companyId);
      }

      return createNegotiationLineApi(dayId, payload, companyId);
    },
    onSuccess: (_, { lineId }) => {
      toast.success(lineId ? "Línea actualizada." : "Línea creada.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteLine = useMutation({
    mutationFn: (lineId: number) =>
      deleteNegotiationLineApi(lineId, companyId),
    onSuccess: () => {
      toast.success("Línea eliminada.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { saveLine, deleteLine };
}

export function useNegotiationQuotaMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const saveQuota = useMutation({
    mutationFn: ({
      dayId,
      quotaId,
      values,
    }: {
      dayId: number;
      quotaId?: number;
      values: NegotiationQuotaFormValues;
    }) => {
      if (quotaId) {
        return updateQuotaApi(
          quotaId,
          {
            quotaAmount: values.quotaAmount,
            maxDailyAmount: values.maxDailyAmount,
            differenceAmount: values.differenceAmount || 0,
            status: values.status,
          },
          companyId,
        );
      }

      return createQuotaApi(
        dayId,
        {
          commercialRepId: values.commercialRepId!,
          otcCounterpartyId: values.otcCounterpartyId!,
          quotaAmount: values.quotaAmount,
          maxDailyAmount: values.maxDailyAmount,
          differenceAmount: values.differenceAmount || 0,
          status: values.status,
        },
        companyId,
      );
    },
    onSuccess: (_, { quotaId }) => {
      toast.success(quotaId ? "Cupo actualizado." : "Cupo creado.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteQuotaMutation = useMutation({
    mutationFn: (quotaId: number) => deleteQuotaApi(quotaId, companyId),
    onSuccess: () => {
      toast.success("Cupo eliminado.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { saveQuota, deleteQuota: deleteQuotaMutation };
}

export function useNegotiationScenarioMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const saveScenario = useMutation({
    mutationFn: ({
      dayId,
      scenarioId,
      values,
    }: {
      dayId: number;
      scenarioId?: number;
      values: NegotiationScenarioFormValues;
    }) => {
      const payload = {
        name: values.name.trim(),
        costPercent: values.costPercent || null,
        spread: values.spread ?? null,
        cobreRate: values.cobreRate ?? null,
        closingRate: values.closingRate ?? null,
        sortOrder: values.sortOrder || 0,
      };

      if (scenarioId) {
        return updateRateScenarioApi(scenarioId, payload, companyId);
      }

      return createRateScenarioApi(dayId, payload, companyId);
    },
    onSuccess: (_, { scenarioId }) => {
      toast.success(scenarioId ? "Escenario actualizado." : "Escenario creado.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteScenario = useMutation({
    mutationFn: (scenarioId: number) =>
      deleteRateScenarioApi(scenarioId, companyId),
    onSuccess: () => {
      toast.success("Escenario eliminado.");
      invalidateNegotiations(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { saveScenario, deleteScenario };
}
