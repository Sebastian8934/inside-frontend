"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  AlertTriangle,
  Building2,
  ExternalLink,
  RefreshCw,
  Truck,
  Wallet,
  Handshake,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankMovementSummary } from "@/components/features/banking/hooks/use-bank-movement-summary";
import { useDeliveryClientSummary } from "@/components/features/delivery/hooks/use-delivery-client-summary";
import { useMovementsList } from "@/components/features/inventory/movements/hooks/use-movements-list";
import { useNegotiationDays } from "@/components/features/negotiations/hooks/use-negotiation-days";
import { useLiquidityMutations } from "@/components/features/liquidity/hooks/use-liquidity-mutations";
import { LoadingState } from "@/components/shared/data-states";
import type { DailyLiquidityCloseDetail } from "@/types/liquidity";
import { isLiquidityCloseDraft } from "@/types/liquidity";
import { isNegotiationDayOpen } from "@/types/negotiations";
import { formatCop, formatUsdt } from "@/lib/utils/format";

type Props = {
  close: DailyLiquidityCloseDetail;
  companyId: number;
};

export function LiquiditySourcePanels({ close, companyId }: Props) {
  const isDraft = isLiquidityCloseDraft(close.status);
  const operationDate = close.operationDate;
  const operationDateObj = new Date(`${operationDate}T00:00:00`);
  const { refreshFromDelivery, refreshSources } = useLiquidityMutations(companyId);

  const deliveryFilters = useMemo(
    () => ({ companyId, currentYear: operationDateObj.getFullYear() }),
    [companyId, operationDateObj],
  );

  const inventoryFilters = useMemo(
    () => ({
      companyId,
      dateFrom: operationDate,
      dateTo: operationDate,
    }),
    [companyId, operationDate],
  );

  const negotiationFilters = useMemo(
    () => ({
      companyId,
      dateFrom: operationDate,
      dateTo: operationDate,
    }),
    [companyId, operationDate],
  );

  const bankFilters = useMemo(
    () => ({
      companyId,
      periodMonth: operationDateObj.getMonth() + 1,
      periodYear: operationDateObj.getFullYear(),
    }),
    [companyId, operationDateObj],
  );

  const { data: deliverySummary = [], isLoading: deliveryLoading } =
    useDeliveryClientSummary(deliveryFilters);
  const { data: movements = [], isLoading: inventoryLoading } =
    useMovementsList(inventoryFilters);
  const { data: negotiationDays = [], isLoading: negotiationsLoading } =
    useNegotiationDays(negotiationFilters);
  const { data: bankSummary = [], isLoading: banksLoading } =
    useBankMovementSummary(bankFilters);

  const deliveryTotal = deliverySummary.reduce(
    (sum, row) => sum + row.saldoTotal,
    0,
  );
  const clientsWithBalance = deliverySummary.filter(
    (row) => row.saldoTotal !== 0,
  ).length;

  const inventoryUsdtNet = movements.reduce(
    (sum, row) => sum + row.usdtAmount,
    0,
  );
  const inventoryCopTotal = movements.reduce(
    (sum, row) => sum + (row.totalCop ?? 0),
    0,
  );

  const bankTotal = bankSummary.reduce(
    (sum, row) => sum + row.disponible,
    0,
  );
  const bankHolders = bankSummary.filter((row) => row.disponible !== 0).length;

  const negotiationDay = negotiationDays[0];
  const negotiationOpen = negotiationDay
    ? isNegotiationDayOpen(negotiationDay.status)
    : false;

  const deliveryMatches =
    close.pendingDeliveryCop != null &&
    Math.abs(close.pendingDeliveryCop - deliveryTotal) < 0.01;

  const cargueMatches =
    close.usdtBalanceCop != null &&
    Math.abs(close.usdtBalanceCop - inventoryCopTotal) < 0.01;

  const accountsMatches =
    close.accountsBalanceCop != null &&
    Math.abs(close.accountsBalanceCop - bankTotal) < 0.01;

  const isRefreshing =
    refreshFromDelivery.isPending || refreshSources.isPending;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Fuentes del cierre
          </h2>
          <p className="text-sm text-muted-foreground">
            Datos de otros módulos para el día {operationDate}. Aplique
            automáticamente o revise antes de cerrar.
          </p>
        </div>
        {isDraft ? (
          <Button
            size="sm"
            onClick={() =>
              refreshSources.mutate({
                closeId: close.id,
                options: { delivery: true, inventory: true, banks: true },
              })
            }
            disabled={isRefreshing}
          >
            <Zap className="mr-2 size-4" />
            Aplicar todas las fuentes
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SourceCard
          icon={Truck}
          title="Delivery"
          loading={deliveryLoading}
          href="/delivery"
        >
          <Metric label="Pendiente clientes" value={formatCop(deliveryTotal)} />
          <Metric
            label="Clientes con saldo"
            value={String(clientsWithBalance)}
          />
          <Metric
            label="En cierre"
            value={
              close.pendingDeliveryCop != null
                ? formatCop(close.pendingDeliveryCop)
                : "—"
            }
            highlight={!deliveryMatches}
          />
          {isDraft ? (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => refreshFromDelivery.mutate(close.id)}
              disabled={isRefreshing}
            >
              <RefreshCw className="mr-2 size-4" />
              Aplicar delivery
            </Button>
          ) : null}
        </SourceCard>

        <SourceCard
          icon={Wallet}
          title="Inventario USDT"
          loading={inventoryLoading}
          href="/inventario"
        >
          <Metric label="Movimientos del día" value={String(movements.length)} />
          <Metric label="USDT neto" value={formatUsdt(inventoryUsdtNet)} />
          <Metric
            label="Total COP registrado"
            value={formatCop(inventoryCopTotal)}
          />
          <Metric
            label="Cargue en cierre"
            value={
              close.usdtBalanceCop != null
                ? formatCop(close.usdtBalanceCop)
                : "—"
            }
            highlight={movements.length > 0 && !cargueMatches}
          />
          {isDraft ? (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() =>
                refreshSources.mutate({
                  closeId: close.id,
                  options: {
                    delivery: false,
                    inventory: true,
                    banks: false,
                  },
                })
              }
              disabled={isRefreshing}
            >
              <RefreshCw className="mr-2 size-4" />
              Aplicar cargue USDT
            </Button>
          ) : null}
        </SourceCard>

        <SourceCard
          icon={Building2}
          title="Bancos"
          loading={banksLoading}
          href="/bancos"
        >
          <Metric
            label={`Disponible ${bankFilters.periodMonth}/${bankFilters.periodYear}`}
            value={formatCop(bankTotal)}
          />
          <Metric label="Titulares con saldo" value={String(bankHolders)} />
          <Metric
            label="Cuentas en cierre"
            value={
              close.accountsBalanceCop != null
                ? formatCop(close.accountsBalanceCop)
                : "—"
            }
            highlight={bankHolders > 0 && !accountsMatches}
          />
          {isDraft ? (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={() =>
                refreshSources.mutate({
                  closeId: close.id,
                  options: {
                    delivery: false,
                    inventory: false,
                    banks: true,
                  },
                })
              }
              disabled={isRefreshing}
            >
              <RefreshCw className="mr-2 size-4" />
              Aplicar cuentas bancarias
            </Button>
          ) : null}
        </SourceCard>

        <SourceCard
          icon={Handshake}
          title="Negociaciones"
          loading={negotiationsLoading}
          href="/negociaciones"
        >
          {!negotiationDay ? (
            <p className="text-sm text-muted-foreground">
              No hay día de negociación para esta fecha.
            </p>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={negotiationOpen ? "destructive" : "secondary"}>
                  {negotiationDay.status}
                </Badge>
                {negotiationOpen ? (
                  <AlertTriangle className="size-4 text-amber-600" />
                ) : null}
              </div>
              <Metric
                label="Líneas"
                value={String(negotiationDay.lineCount)}
              />
              <Metric
                label="Total negociado"
                value={
                  negotiationDay.grandTotalCop != null
                    ? formatCop(negotiationDay.grandTotalCop)
                    : "—"
                }
              />
              {negotiationOpen ? (
                <p className="mt-2 text-xs text-amber-700">
                  Debe cerrar las negociaciones antes de cerrar la liquidez.
                </p>
              ) : null}
            </>
          )}
        </SourceCard>
      </div>
    </div>
  );
}

function SourceCard({
  icon: Icon,
  title,
  loading,
  href,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  loading: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4 text-gray-500" />
          {title}
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
          <Link href={href}>
            <ExternalLink className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        {loading ? <LoadingState label="Cargando..." /> : children}
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-medium tabular-nums ${highlight ? "text-amber-700" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
