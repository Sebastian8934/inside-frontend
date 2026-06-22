"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WithdrawalConsolidatedTab } from "@/components/features/withdrawals/components/withdrawal-consolidated-tab";
import { WithdrawalDayTab } from "@/components/features/withdrawals/components/withdrawal-day-tab";
import { PageHeader } from "@/components/shared/page-header";

export function WithdrawalsPageContent() {
  return (
    <div className="p-6">
      <PageHeader
        title="Retiros"
        description="Reporte diario de retiros y consolidado mensual"
      />

      <Tabs defaultValue="dia" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dia">Retiros del día</TabsTrigger>
          <TabsTrigger value="consolidado">Consolidado</TabsTrigger>
        </TabsList>
        <TabsContent value="dia">
          <WithdrawalDayTab />
        </TabsContent>
        <TabsContent value="consolidado">
          <WithdrawalConsolidatedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
