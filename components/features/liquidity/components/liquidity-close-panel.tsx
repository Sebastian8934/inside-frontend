"use client";

import { Loader2, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useLiquidityCloseForm } from "@/components/features/liquidity/hooks/use-liquidity-close-form";
import { useLiquidityMutations } from "@/components/features/liquidity/hooks/use-liquidity-mutations";
import type { DailyLiquidityCloseDetail } from "@/types/liquidity";
import { isLiquidityCloseDraft } from "@/types/liquidity";
import { formatCop, formatDateOnly } from "@/lib/utils/format";

type Props = {
  close: DailyLiquidityCloseDetail;
  companyId: number;
};

export function LiquidityClosePanel({ close, companyId }: Props) {
  const isDraft = isLiquidityCloseDraft(close.status);
  const { form, handleSubmit, isSubmitting } = useLiquidityCloseForm({
    close,
    companyId,
  });
  const { refreshFromDelivery, closeDay } = useLiquidityMutations(companyId);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">FECHA</p>
            <p className="text-lg font-semibold">
              {formatDateOnly(close.operationDate)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">ESTADO</p>
            <Badge variant={isDraft ? "default" : "secondary"}>
              {close.status}
            </Badge>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50 lg:col-span-2">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">SALDO INSIDE</p>
            <p className="text-2xl font-bold tabular-nums text-blue-900">
              {close.saldoInsideCop != null
                ? formatCop(close.saldoInsideCop)
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <BalanceCard label="Cuentas" value={close.accountsBalanceCop} />
        <BalanceCard label="Efectivo" value={close.cashBalanceCop} />
        <BalanceCard label="CxP proveedor" value={close.payablesBalanceCop} />
        <BalanceCard label="Pend. delivery" value={close.pendingDeliveryCop} />
        <BalanceCard label="Cargue USDT" value={close.usdtBalanceCop} />
      </div>

      <Form {...form}>
        <form
          id="liquidity-close-notes-form"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Card>
            <CardContent className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDraft}
                        rows={3}
                        maxLength={1000}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          form="liquidity-close-notes-form"
          disabled={!isDraft || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : null}
          Guardar notas
        </Button>
        <Button
          variant="outline"
          onClick={() => refreshFromDelivery.mutate(close.id)}
          disabled={!isDraft || refreshFromDelivery.isPending}
        >
          <RefreshCw className="mr-2 size-4" />
          Actualizar delivery
        </Button>
        <Button
          variant="destructive"
          onClick={() => closeDay.mutate(close.id)}
          disabled={!isDraft || closeDay.isPending}
        >
          <Lock className="mr-2 size-4" />
          Cerrar liquidez
        </Button>
      </div>
    </div>
  );
}

function BalanceCard({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-gray-600">{label.toUpperCase()}</p>
        <p className="text-lg font-semibold tabular-nums">
          {value != null ? formatCop(value) : "—"}
        </p>
      </CardContent>
    </Card>
  );
}
