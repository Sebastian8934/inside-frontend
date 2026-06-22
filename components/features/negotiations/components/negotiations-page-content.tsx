"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NegotiationDayPanel } from "@/components/features/negotiations/components/negotiation-day-panel";
import { NegotiationLinesTab } from "@/components/features/negotiations/components/negotiation-lines-tab";
import { NegotiationQuotasTab } from "@/components/features/negotiations/components/negotiation-quotas-tab";
import { NegotiationScenariosTab } from "@/components/features/negotiations/components/negotiation-scenarios-tab";
import { useNegotiationDayDetail } from "@/components/features/negotiations/hooks/use-negotiation-day-detail";
import { useNegotiationDays } from "@/components/features/negotiations/hooks/use-negotiation-days";
import { useNegotiationDayMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { formatDateOnly } from "@/lib/utils/format";

export function NegotiationsPageContent() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const operationDate = toDateOnlyString(operativeDate);

  const dayFilters = useMemo(
    () => ({ companyId, dateFrom: operationDate, dateTo: operationDate }),
    [companyId, operationDate],
  );

  const { data: dayList, isLoading: daysLoading } = useNegotiationDays(dayFilters);
  const dayId = dayList?.[0]?.id;

  const { data: dayDetail, isLoading: detailLoading } = useNegotiationDayDetail(
    dayId,
    companyId,
  );

  const { createDay } = useNegotiationDayMutations(companyId);

  const isLoading = daysLoading || (dayId ? detailLoading : false);

  if (!companyId) {
    return (
      <div className="p-6">
        <PageHeader
          title="Negociaciones"
          description="Operaciones diarias de negociación USDT/COP"
        />
        <EmptyState message="Seleccione una empresa." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Negociaciones"
          description={`Operaciones — ${formatDateOnly(operationDate)}`}
        />
        <LoadingState label="Cargando negociaciones..." />
      </div>
    );
  }

  if (!dayId) {
    return (
      <div className="p-6">
        <PageHeader
          title="Negociaciones"
          description={`Operaciones — ${formatDateOnly(operationDate)}`}
        />
        <div className="space-y-4 py-12 text-center">
          <EmptyState
            message={`No hay día de negociación para ${formatDateOnly(operationDate)}.`}
          />
          <Button
            onClick={() => createDay.mutate(operationDate)}
            disabled={createDay.isPending}
          >
            <Plus className="mr-2 size-4" />
            Crear día de negociación
          </Button>
        </div>
      </div>
    );
  }

  if (!dayDetail) {
    return (
      <div className="p-6">
        <LoadingState label="Cargando detalle..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Negociaciones"
        description={`Operaciones — ${formatDateOnly(dayDetail.operationDate)}`}
      />

      <NegotiationDayPanel day={dayDetail} companyId={companyId} />

      <Tabs defaultValue="lineas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lineas">
            Líneas ({dayDetail.lines.length})
          </TabsTrigger>
          <TabsTrigger value="escenarios">
            Escenarios ({dayDetail.rateScenarios.length})
          </TabsTrigger>
          <TabsTrigger value="cupos">
            Cupos ({dayDetail.dailyQuotas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lineas">
          <NegotiationLinesTab day={dayDetail} companyId={companyId} />
        </TabsContent>

        <TabsContent value="escenarios">
          <NegotiationScenariosTab day={dayDetail} companyId={companyId} />
        </TabsContent>

        <TabsContent value="cupos">
          <NegotiationQuotasTab day={dayDetail} companyId={companyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
