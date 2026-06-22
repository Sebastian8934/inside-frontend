"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockchainTab } from "@/components/features/inventory/blockchain";
import { MovementsTab } from "@/components/features/inventory/movements";
import { OtcSummaryTab } from "@/components/features/inventory/otc-summary";
import { PageHeader } from "@/components/shared/page-header";

export function InventoryPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab =
    tabParam === "otc" || tabParam === "blockchain" ? tabParam : "movimientos";

  return (
    <div className="p-6">
      <PageHeader
        title="Inventario USDT"
        description="Ledger de movimientos USDT"
      />

      <Tabs key={defaultTab} defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="otc">Resumen OTC</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        <TabsContent value="movimientos">
          <MovementsTab />
        </TabsContent>
        <TabsContent value="otc">
          <OtcSummaryTab />
        </TabsContent>
        <TabsContent value="blockchain">
          <BlockchainTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
