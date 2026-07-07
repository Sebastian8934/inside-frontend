"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLiquidityCloses } from "@/components/features/liquidity/hooks/use-liquidity-closes";
import { useLiquidityCloseDetail } from "@/components/features/liquidity/hooks/use-liquidity-close-detail";
import { ReportExportButtons } from "@/components/features/reports/components/report-export-buttons";
import { buildLiquidityDailyReportData } from "@/components/features/reports/lib/build-liquidity-daily-report";
import { OperationDateFilter } from "@/components/shared/operation-date-filter";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useOperationDate } from "@/hooks/use-operation-date";
import {
  LIQUIDITY_CATEGORY_LABELS,
  type DailyLiquidityCloseDetail,
} from "@/types/liquidity";
import { formatCop, formatDateOnly } from "@/lib/utils/format";

export function LiquidityDailyReport() {
  const companyId = useActiveCompanyId();
  const { operationDate, setOperationDate, operationDateString } =
    useOperationDate();

  const closeFilters = useMemo(
    () => ({
      companyId,
      dateFrom: operationDateString,
      dateTo: operationDateString,
    }),
    [companyId, operationDateString],
  );

  const { data: closeList, isLoading: listLoading } =
    useLiquidityCloses(closeFilters);
  const closeId = closeList?.[0]?.id;

  const { data: closeDetail, isLoading: detailLoading } =
    useLiquidityCloseDetail(closeId, companyId);

  const reportData = useMemo(
    () => (closeDetail ? buildLiquidityDailyReportData(closeDetail) : null),
    [closeDetail],
  );

  const isLoading = listLoading || (closeId ? detailLoading : false);

  if (!companyId) {
    return (
      <div className="p-6">
        <EmptyState message="Seleccione una empresa para generar el informe." />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/informes">
            <ArrowLeft className="size-4" />
            Informes
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Liquidez diaria (SALDO INSIDE)"
        description="Cierre de tesorería del día. Exportable en PDF, Excel y Word."
        filters={
          <OperationDateFilter
            date={operationDate}
            onDateChange={setOperationDate}
          />
        }
        actions={
          <ReportExportButtons
            data={reportData}
            disabled={isLoading || !closeDetail}
          />
        }
      />

      {isLoading ? (
        <LoadingState label="Cargando cierre de liquidez..." />
      ) : !closeDetail ? (
        <EmptyState
          message={`No hay cierre de liquidez para ${formatDateOnly(operationDateString)}.`}
        />
      ) : (
        <LiquidityReportView close={closeDetail} />
      )}
    </div>
  );
}

function LiquidityReportView({ close }: { close: DailyLiquidityCloseDetail }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Estado" value={close.status} />
        <KpiCard
          label="SALDO INSIDE"
          value={formatCop(close.saldoInsideCop ?? 0)}
          highlight
        />
        <KpiCard
          label="Pendiente delivery"
          value={formatCop(close.pendingDeliveryCop ?? 0)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead className="text-right">Valor COP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SummaryRow label="Cuentas" value={close.accountsBalanceCop} />
              <SummaryRow label="Efectivo" value={close.cashBalanceCop} />
              <SummaryRow label="CxP proveedor" value={close.payablesBalanceCop} />
              <SummaryRow label="Pend. delivery" value={close.pendingDeliveryCop} />
              <SummaryRow label="Cargue USDT" value={close.usdtBalanceCop} />
              <TableRow className="bg-blue-50/50 font-semibold">
                <TableCell>SALDO INSIDE</TableCell>
                <TableCell className="text-right tabular-nums text-blue-900">
                  {formatCop(close.saldoInsideCop ?? 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {close.positionLines.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Monto COP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {close.positionLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      {LIQUIDITY_CATEGORY_LABELS[line.category] ?? line.category}
                    </TableCell>
                    <TableCell>{line.concept}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(line.amountCop)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell className="text-right tabular-nums">
        {value != null ? formatCop(value) : "—"}
      </TableCell>
    </TableRow>
  );
}

function KpiCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-blue-200 bg-blue-50/50" : undefined}>
      <CardContent className="p-4">
        <p className="text-xs text-gray-600">{label.toUpperCase()}</p>
        <p
          className={`text-xl font-bold tabular-nums ${
            highlight ? "text-blue-900" : ""
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
