"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOtcSummaryList } from "@/components/features/inventory/otc-summary/hooks/use-otc-summary-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { formatCop, formatUsdt, usdtColorClass } from "@/lib/utils/format";

export function OtcSummaryTab() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const date = toDateOnlyString(operativeDate);

  const { data, isLoading } = useOtcSummaryList({ companyId, date });

  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && data?.length === 0 ? (
          <EmptyState message="No hay resumen OTC para la fecha operativa." />
        ) : null}
        {data && data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contraparte</TableHead>
                <TableHead>Dispersado COP</TableHead>
                <TableHead>Cobro COP</TableHead>
                <TableHead>Utilidad COP</TableHead>
                <TableHead>Saldo USDT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.otcCounterpartyId}>
                  <TableCell className="font-medium">
                    {item.otcCounterpartyCode}
                  </TableCell>
                  <TableCell>{formatCop(item.dispersadoCop)}</TableCell>
                  <TableCell>{formatCop(item.cobroCop)}</TableCell>
                  <TableCell>{formatCop(item.utilidadCop)}</TableCell>
                  <TableCell className={usdtColorClass(item.saldoUsdt)}>
                    {formatUsdt(item.saldoUsdt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}
