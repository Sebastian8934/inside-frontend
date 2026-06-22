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
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { formatDateOnly } from "@/lib/utils/format";

export function LiquidityPageContent() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const operationDate = toDateOnlyString(operativeDate);

  const closeFilters = useMemo(
    () => ({ companyId, dateFrom: operationDate, dateTo: operationDate }),
    [companyId, operationDate],
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
          description={`Operaciones — ${formatDateOnly(operationDate)}`}
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
          description={`Operaciones — ${formatDateOnly(operationDate)}`}
        />
        <div className="space-y-4 py-12 text-center">
          <EmptyState
            message={`No hay cierre de liquidez para ${formatDateOnly(operationDate)}.`}
          />
          <Button
            onClick={() => createClose.mutate(operationDate)}
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
      />

      <LiquidityClosePanel close={closeDetail} companyId={companyId} />

      <LiquidityPositionLinesSection
        close={closeDetail}
        companyId={companyId}
      />
    </div>
  );
}
