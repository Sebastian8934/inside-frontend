"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNegotiationCatalogQueries } from "@/components/features/negotiations/hooks/use-negotiation-catalog-queries";
import { useNegotiationLineForm } from "@/components/features/negotiations/hooks/use-negotiation-line-form";
import {
  FormModal,
  FormModalFooter,
} from "@/components/shared/form-modal";
import type { NegotiationLine } from "@/types/negotiations";
import {
  NEGOTIATION_LINE_STATUSES,
  NEGOTIATION_SIDES,
} from "@/types/negotiations";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: number;
  companyId: number;
  line: NegotiationLine | null;
  nextLineNumber: number;
};

export function NegotiationLineSheet({
  open,
  onOpenChange,
  dayId,
  companyId,
  line,
  nextLineNumber,
}: Props) {
  const { platforms, counterparties, commercialReps } =
    useNegotiationCatalogQueries(companyId, open);

  const { form, handleSubmit, isEditing, isSubmitting } = useNegotiationLineForm(
    {
      open,
      line,
      dayId,
      companyId,
      nextLineNumber,
      onSuccess: () => onOpenChange(false),
    },
  );

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={isEditing ? "Editar línea" : "Nueva línea"}
      footer={
        <FormModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="negotiation-line-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="negotiation-line-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="lineNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel># Línea</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NEGOTIATION_LINE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="platformId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plataforma</FormLabel>
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(v) =>
                    field.onChange(v === "none" ? null : Number(v))
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Plataforma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {platforms.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lado</FormLabel>
                  <Select
                    value={field.value ?? "none"}
                    onValueChange={(v) =>
                      field.onChange(v === "none" ? null : v)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      {NEGOTIATION_SIDES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otcCounterpartyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraparte OTC</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : "none"}
                    onValueChange={(v) =>
                      field.onChange(v === "none" ? null : Number(v))
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      {counterparties.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="commercialRepId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comercial</FormLabel>
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(v) =>
                    field.onChange(v === "none" ? null : Number(v))
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {commercialReps.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.initials} — {r.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordenante</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="quantityUsdt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USDT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalCop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total COP</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spotRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spot rate</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="netRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net rate</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtotalCop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal COP</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="externalNegotiationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID externo</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="loadReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ref. carga</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormModal>
  );
}
