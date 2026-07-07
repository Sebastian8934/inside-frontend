"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidityClosePanel } from "@/components/features/liquidity/components/liquidity-close-panel";
import { LiquidityPositionLinesSection } from "@/components/features/liquidity/components/liquidity-position-lines-section";
import { useLiquidityCloseDetail } from "@/components/features/liquidity/hooks/use-liquidity-close-detail";
import { useLiquidityCloses } from "@/components/features/liquidity/hooks/use-liquidity-closes";
import { useLiquidityMutations } from "@/components/features/liquidity/hooks/use-liquidity-mutations";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { LiquiditySourcePanels } from "@/components/features/liquidity/components/liquidity-source-panels";
import { OperationDateFilter } from "@/components/shared/operation-date-filter";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useOperationDate } from "@/hooks/use-operation-date";
import { formatDateOnly } from "@/lib/utils/format";

export function LiquidityPageContent() {
  const companyId = useActiveCompanyId();
  const { operationDate, setOperationDate, operationDateString: operationDateStr } =
    useOperationDate();

  const closeFilters = useMemo(
    () => ({ companyId, dateFrom: operationDateStr, dateTo: operationDateStr }),
    [companyId, operationDateStr],
  );

  const { data: closeList, isLoading: closesLoading } =
    useLiquidityCloses(closeFilters);

  const closeId = closeList?.[0]?.id;

  const { data: closeDetail, isLoading: detailLoading } =
    useLiquidityCloseDetail(closeId, companyId);

  const { createClose } = useLiquidityMutations(companyId);

  const isLoading = closesLoading || (closeId ? detailLoading : false);

  if (!companyId) {
    return (
      <div className="p-6">
        <PageHeader
          title="Liquidez diaria"
          description="Cierre diario de posición de liquidez"
          filters={
            <OperationDateFilter
              date={operationDate}
              onDateChange={setOperationDate}
            />
          }
        />
        <EmptyState message="Seleccione una empresa." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Liquidez diaria"
          description={`Operaciones — ${formatDateOnly(operationDateStr)}`}
          filters={
            <OperationDateFilter
              date={operationDate}
              onDateChange={setOperationDate}
            />
          }
        />
        <LoadingState label="Cargando liquidez..." />
      </div>
    );
  }

  if (!closeId) {
    return (
      <div className="p-6">
        <PageHeader
          title="Liquidez diaria"
          description={`Operaciones — ${formatDateOnly(operationDateStr)}`}
          filters={
            <OperationDateFilter
              date={operationDate}
              onDateChange={setOperationDate}
            />
          }
        />
        <div className="space-y-4 py-12 text-center">
          <EmptyState
            message={`No hay cierre de liquidez para ${formatDateOnly(operationDateStr)}.`}
          />
          <Button
            onClick={() => createClose.mutate(operationDateStr)}
            disabled={createClose.isPending}
          >
            <Plus className="mr-2 size-4" />
            Crear cierre de liquidez
          </Button>
        </div>
      </div>
    );
  }

  if (!closeDetail) {
    return (
      <div className="p-6">
        <LoadingState label="Cargando detalle..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Liquidez diaria"
        description={`Cierre — ${formatDateOnly(closeDetail.operationDate)}`}
        filters={
          <OperationDateFilter
            date={operationDate}
            onDateChange={setOperationDate}
          />
        }
      />

      <LiquiditySourcePanels close={closeDetail} companyId={companyId} />

      <LiquidityClosePanel close={closeDetail} companyId={companyId} />

      <LiquidityPositionLinesSection
        close={closeDetail}
        companyId={companyId}
      />
    </div>
  );
}
