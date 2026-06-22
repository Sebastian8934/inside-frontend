"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AccountHoldersTab,
  BankMovementsTab,
  BankSummaryTab,
} from "@/components/features/banking";
import { PageHeader } from "@/components/shared/page-header";
import { useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { getPeriodFromDate, MONTH_NAMES } from "@/types/banking";
import { formatDateOnly } from "@/lib/utils/format";

export function BankingPageContent() {
  const operativeDate = useOperativeDate();
  const operationDate = toDateOnlyString(operativeDate);
  const { periodMonth, periodYear } = getPeriodFromDate(operativeDate);
  const periodLabel = `${MONTH_NAMES[periodMonth - 1]} ${periodYear}`;

  return (
    <div className="p-6">
      <PageHeader
        title="Bancos"
        description={`Movimientos bancarios y titulares — ${periodLabel} · ${formatDateOnly(operationDate)}`}
      />

      <Tabs defaultValue="movimientos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="resumen">Resumen por titular</TabsTrigger>
          <TabsTrigger value="titulares">Titulares</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos">
          <BankMovementsTab />
        </TabsContent>

        <TabsContent value="resumen">
          <BankSummaryTab />
        </TabsContent>

        <TabsContent value="titulares">
          <AccountHoldersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
