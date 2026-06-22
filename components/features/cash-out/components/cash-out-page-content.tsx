"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CashOutExpensesTab } from "@/components/features/cash-out/components/cash-out-expenses-tab";
import { CashOutPayrollTab } from "@/components/features/cash-out/components/cash-out-payroll-tab";
import { CashOutTransactionCostsTab } from "@/components/features/cash-out/components/cash-out-transaction-costs-tab";
import { PageHeader } from "@/components/shared/page-header";
import { useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { getPeriodFromDate, MONTH_NAMES } from "@/types/cash-out";
import { formatDateOnly } from "@/lib/utils/format";

export function CashOutPageContent() {
  const operativeDate = useOperativeDate();
  const operationDate = toDateOnlyString(operativeDate);
  const { periodMonth, periodYear } = getPeriodFromDate(operativeDate);
  const periodLabel = `${MONTH_NAMES[periodMonth - 1]} ${periodYear}`;

  return (
    <div className="p-6">
      <PageHeader
        title="Cash out"
        description={`Egresos, nómina y costos — ${periodLabel} · ${formatDateOnly(operationDate)}`}
      />

      <Tabs defaultValue="egresos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="egresos">Egresos</TabsTrigger>
          <TabsTrigger value="nomina">Nómina</TabsTrigger>
          <TabsTrigger value="costos">Costos por transacción</TabsTrigger>
        </TabsList>

        <TabsContent value="egresos">
          <CashOutExpensesTab />
        </TabsContent>

        <TabsContent value="nomina">
          <CashOutPayrollTab />
        </TabsContent>

        <TabsContent value="costos">
          <CashOutTransactionCostsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
