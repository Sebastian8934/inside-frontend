"use client";

import Link from "next/link";
import { useClientPortalDashboard } from "@/components/features/client-portal/hooks/use-client-portal-dashboard";
import { ArrowRight, Coins, Truck } from "lucide-react";
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
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import {
  formatCop,
  formatDate,
  formatUsdt,
  usdtColorClass,
} from "@/lib/utils/format";

export function ClientPortalDashboard() {
  const currentYear = new Date().getFullYear();
  const { deliverySummary, loans, isLoading } =
    useClientPortalDashboard(currentYear);

  const delivery = deliverySummary[0];
  const loan = loans[0];

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Inicio"
        description="Resumen de tus saldos de delivery y préstamos USDT"
      />

      {isLoading ? (
        <LoadingState label="Cargando tu información..." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="size-4" />
                  Saldo delivery total
                </div>
                <p
                  className={`text-3xl font-bold tabular-nums ${
                    delivery && delivery.saldoTotal > 0
                      ? "text-red-700"
                      : delivery && delivery.saldoTotal < 0
                        ? "text-green-700"
                        : ""
                  }`}
                >
                  {delivery ? formatCop(delivery.saldoTotal) : formatCop(0)}
                </p>
                {delivery ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Cliente {delivery.clientCode} · Saldo {currentYear}:{" "}
                    {formatCop(delivery.saldoCurrentYear)}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sin movimientos de delivery registrados.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                  <Coins className="size-4" />
                  USDT pendiente
                </div>
                <p
                  className={`text-3xl font-bold tabular-nums ${usdtColorClass(loan?.pendingUsdt ?? 0)}`}
                >
                  {formatUsdt(loan?.pendingUsdt ?? 0)}
                </p>
                {loan ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Prestado: {formatUsdt(loan.lentUsdt)} · Devuelto:{" "}
                    {formatUsdt(loan.returnedUsdt)}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sin préstamos USDT registrados.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <p className="mb-2 text-sm text-gray-600">Accesos rápidos</p>
                  <p className="text-sm text-muted-foreground">
                    Consulta el detalle de movimientos y saldos históricos.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/delivery">
                      Ver delivery
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/prestamos-usdt">
                      Ver préstamos
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Delivery — desglose</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/delivery">Ver detalle</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {!delivery ? (
                  <EmptyState message="Sin datos de delivery para mostrar." />
                ) : (
                  <Table>
                    <TableBody>
                      <SummaryRow label="Por pagar (histórico)" value={delivery.porPagarTotal} />
                      <SummaryRow label="Pagado (histórico)" value={delivery.pagadoTotal} />
                      <SummaryRow label="Saldo año anterior" value={delivery.saldoPriorYear} />
                      <SummaryRow
                        label={`Por pagar ${currentYear}`}
                        value={delivery.porPagarCurrentYear}
                      />
                      <SummaryRow
                        label={`Pagado ${currentYear}`}
                        value={delivery.pagadoCurrentYear}
                      />
                      <SummaryRow
                        label={`Saldo ${currentYear}`}
                        value={delivery.saldoCurrentYear}
                        highlight
                      />
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Préstamo USDT</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/prestamos-usdt">Ver detalle</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {!loan ? (
                  <EmptyState message="Sin préstamos USDT registrados." />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concepto</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Prestado</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {loan.lentUsdt.toLocaleString("es-CO", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          })}{" "}
                          USDT
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Devuelto</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {loan.returnedUsdt.toLocaleString("es-CO", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          })}{" "}
                          USDT
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Pendiente</TableCell>
                        <TableCell
                          className={`text-right tabular-nums font-semibold ${usdtColorClass(loan.pendingUsdt)}`}
                        >
                          {loan.pendingUsdt.toLocaleString("es-CO", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          })}{" "}
                          USDT
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tasa promedio</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {loan.averageRate?.toLocaleString("es-CO") ?? "—"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Última actualización</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {formatDate(loan.updatedAt)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <TableRow className={highlight ? "bg-blue-50/50 font-semibold" : undefined}>
      <TableCell>{label}</TableCell>
      <TableCell className="text-right tabular-nums">{formatCop(value)}</TableCell>
    </TableRow>
  );
}
