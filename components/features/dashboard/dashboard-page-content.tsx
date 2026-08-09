"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Handshake,
  Link2,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboard } from "@/components/features/dashboard/hooks/use-dashboard";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { OperationDateFilter } from "@/components/shared/operation-date-filter";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useOperationDate } from "@/hooks/use-operation-date";
import {
  buildDashboardKpisFromSummary,
  type DashboardKpi,
} from "@/lib/dashboard/compute-kpis";
import { hasPermission, PERMISSION_CODES } from "@/lib/auth/permissions";
import {
  useIsClientOnly,
  useUserPermissions,
  useUserRoles,
} from "@/hooks/use-user-roles";
import {
  formatCop,
  formatDate,
  formatDateOnly,
  formatUsdt,
  usdtColorClass,
} from "@/lib/utils/format";
import { ClientPortalDashboard } from "@/components/features/client-portal/client-portal-dashboard";

const KPI_ICONS: Record<string, LucideIcon> = {
  "saldo-inside": Wallet,
  "usdt-net": TrendingUp,
  negotiated: Handshake,
  delivery: Users,
  cashout: DollarSign,
  "liquidity-open": AlertTriangle,
};

export function DashboardPageContent() {
  const userRoles = useUserRoles();
  const userPermissions = useUserPermissions();
  const isClientOnly = useIsClientOnly();
  const isOperator =
    !isClientOnly &&
    hasPermission(
      userPermissions,
      PERMISSION_CODES.DashboardView,
      userRoles,
    );
  const companyId = useActiveCompanyId();
  const { operationDate, setOperationDate, operationDateString: date } =
    useOperationDate();

  const { data: dashboard, isLoading, isError } = useDashboard({
    companyId,
    date,
    enabled: isOperator,
  });

  if (isClientOnly) {
    return <ClientPortalDashboard />;
  }

  if (!isOperator) {
    return (
      <div className="p-6">
        <PageHeader title="Inicio" description="Vista general de operaciones" />
        <Card className="max-w-lg">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Tu rol no tiene acceso al panel operativo.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="p-6">
        <EmptyState message="Seleccione una empresa para ver el dashboard." />
      </div>
    );
  }

  const summary = dashboard?.summary;
  const kpis = summary
    ? buildDashboardKpisFromSummary(summary, formatCop, (n) =>
        formatUsdt(n).replace(" USDT", ""),
      )
    : [];

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Inicio"
        description={`Operaciones — ${formatDateOnly(date)}`}
        filters={
          <OperationDateFilter
            date={operationDate}
            onDateChange={setOperationDate}
          />
        }
        actions={
          <>
            <Button size="sm" variant="outline" asChild>
              <Link href="/negociaciones">
                <Plus className="size-4" />
                Negociación
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/inventario">
                <Plus className="size-4" />
                Movimiento USDT
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/cash-out">
                <Plus className="size-4" />
                Egreso
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/liquidez">Cerrar liquidez</Link>
            </Button>
          </>
        }
      />

      {isLoading ? (
        <LoadingState label="Cargando indicadores..." />
      ) : isError ? (
        <EmptyState message="No se pudo cargar el dashboard." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Actividad reciente</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auditoria">Ver todo</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {!dashboard?.recentActivity.length ? (
                  <p className="text-sm text-muted-foreground">
                    Sin actividad reciente registrada.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {dashboard.recentActivity.map((item, index) => (
                      <div
                        key={`${item.activityType}-${item.occurredAt}-${index}`}
                        className="flex items-start gap-3 border-b pb-4 last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {item.activityType}
                            </span>
                            {item.status ? (
                              <Badge variant="secondary" className="text-xs">
                                {item.status}
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(item.occurredAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clientes delivery — top saldos</CardTitle>
              </CardHeader>
              <CardContent>
                {!dashboard?.topDeliveryClients.length ? (
                  <p className="text-sm text-muted-foreground">
                    No hay clientes con saldo delivery.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboard.topDeliveryClients.map((client) => (
                        <TableRow key={client.clientId}>
                          <TableCell className="font-medium">
                            {client.clientCode}
                          </TableCell>
                          <TableCell
                            className={`text-right tabular-nums font-semibold ${usdtColorClass(client.saldoTotal)}`}
                          >
                            {formatCop(client.saldoTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {summary && summary.unmatchedBlockchainCount > 0 ? (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Link2 className="size-5 text-amber-600" />
                  <span>
                    Tienes{" "}
                    <strong>{summary.unmatchedBlockchainCount}</strong>{" "}
                    transacción(es) blockchain sin conciliar.
                  </span>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/inventario?tab=blockchain">Ir a blockchain</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: DashboardKpi }) {
  const Icon = KPI_ICONS[kpi.id] ?? Wallet;
  const positive = kpi.positive ?? kpi.available;

  return (
    <Card
      className={`transition-shadow hover:shadow-md ${
        !kpi.available ? "opacity-80" : ""
      } ${kpi.warning ? "border-amber-300 bg-amber-50/30" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="mb-2 text-sm text-gray-600">{kpi.title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tabular-nums">{kpi.value}</h3>
              {kpi.currency ? (
                <span className="text-sm text-gray-500">{kpi.currency}</span>
              ) : null}
            </div>
            <div className="mt-2 flex items-center gap-1">
              {kpi.available ? (
                positive ? (
                  <ArrowUpRight className="size-4 text-green-600" />
                ) : (
                  <ArrowDownRight
                    className={`size-4 ${kpi.warning ? "text-amber-600" : "text-gray-400"}`}
                  />
                )
              ) : null}
              <span
                className={`text-xs ${kpi.warning ? "text-amber-700" : "text-gray-600"}`}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
          <div
            className={`rounded-lg p-3 ${
              kpi.warning
                ? "bg-amber-100"
                : positive
                  ? "bg-blue-50"
                  : "bg-gray-50"
            }`}
          >
            <Icon
              className={`size-6 ${
                kpi.warning
                  ? "text-amber-600"
                  : positive
                    ? "text-[#2563eb]"
                    : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
