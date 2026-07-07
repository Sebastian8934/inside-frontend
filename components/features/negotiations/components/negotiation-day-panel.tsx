"use client";

import { Loader2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNegotiationDayForm } from "@/components/features/negotiations/hooks/use-negotiation-day-form";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import type { DailyNegotiationDetail } from "@/types/negotiations";
import { isNegotiationDayOpen } from "@/types/negotiations";
import { formatCop, formatDateOnly } from "@/lib/utils/format";
import { useConfirmAction } from "@/hooks/use-confirm-action";

type Props = {
  day: DailyNegotiationDetail;
  companyId: number;
};

export function NegotiationDayPanel({ day, companyId }: Props) {
  const isOpen = isNegotiationDayOpen(day.status);
  const { form, handleSave, handleClose, isSaving, isClosing } =
    useNegotiationDayForm({ day, companyId });
  const { requestConfirm, confirmDialogProps } = useConfirmAction();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">FECHA</p>
            <p className="text-lg font-semibold">
              {formatDateOnly(day.operationDate)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">ESTADO</p>
            <Badge variant={isOpen ? "default" : "secondary"}>{day.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">TOTAL NEGOCIADO</p>
            <p className="text-xl font-bold tabular-nums">
              {day.grandTotalCop != null ? formatCop(day.grandTotalCop) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">LÍNEAS</p>
            <p className="text-xl font-bold">{day.lines.length}</p>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="spotSeticapRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spot Seticap</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!isOpen}
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bollekReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ref. Bollek</FormLabel>
                    <FormControl>
                      <Input
                        disabled={!isOpen}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalCobreCp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Cobre CP</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!isOpen}
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalCobreV3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Cobre V3</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!isOpen}
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalBitso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Bitso</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!isOpen}
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalFinity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Finity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!isOpen}
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grandTotalCop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grand total COP</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!isOpen}
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit" disabled={!isOpen || isSaving}>
              {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Guardar cabecera
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                requestConfirm({
                  title: "¿Cerrar día de negociación?",
                  description:
                    "El día quedará cerrado y no podrá editarse. Verifica líneas y totales antes de continuar.",
                  confirmLabel: "Cerrar día",
                  onConfirm: () => void handleClose(),
                })
              }
              disabled={!isOpen || isClosing}
            >
              <Lock className="mr-2 size-4" />
              Cerrar día
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
