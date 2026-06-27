"use client";

import type { ComponentType } from "react";
import type { CatalogType } from "@/config/catalogs";
import { CashOutCatalogPanel } from "@/components/features/catalogs/cash-out-catalog";
import { CatalogSubNav } from "@/components/features/catalogs/catalog-subnav";
import { ClientsPanel } from "@/components/features/catalogs/clients";
import { CommercialRepsPanel } from "@/components/features/catalogs/commercial-reps";
import { OtcCounterpartiesPanel } from "@/components/features/catalogs/otc-counterparties";
import { PlatformsPanel } from "@/components/features/catalogs/platforms";
import { WalletsPanel } from "@/components/features/catalogs/wallets";
import { WithdrawalCompaniesPanel } from "@/components/features/catalogs/withdrawal-companies";

type CatalogPageContentProps = {
  tipo: CatalogType;
};

const PANELS: Record<CatalogType, ComponentType> = {
  clientes: ClientsPanel,
  cartera: WalletsPanel,
  contrapartes: OtcCounterpartiesPanel,
  plataformas: PlatformsPanel,
  comerciales: CommercialRepsPanel,
  "cash-out": CashOutCatalogPanel,
  "empresas-retiro": WithdrawalCompaniesPanel,
};

export function CatalogPageContent({ tipo }: CatalogPageContentProps) {
  const Panel = PANELS[tipo];

  return (
    <div className="p-6">
      <CatalogSubNav />
      <Panel />
    </div>
  );
}
