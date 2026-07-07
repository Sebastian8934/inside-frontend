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
import { Switch } from "@/components/ui/switch";
import { useMovementCatalogQueries } from "@/components/features/inventory/movements/hooks/use-movement-catalog-queries";
import { useMovementForm } from "@/components/features/inventory/movements/hooks/use-movement-form";
import {
  FormModal,
  FormModalFooter,
  FormModalSection,
} from "@/components/shared/form-modal";
import type { InventoryMovement } from "@/types/inventory";
import { MOVEMENT_TYPES } from "@/types/inventory";

type MovementFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement?: InventoryMovement | null;
  companyId: number | null;
  defaultDate: string;
};

export function MovementFormSheet({
  open,
  onOpenChange,
  movement,
  companyId,
  defaultDate,
}: MovementFormSheetProps) {
  const { clients, wallets, counterparties } = useMovementCatalogQueries(
    companyId,
    open,
  );

  const { form, handleSubmit, isEditing, isSubmitting } = useMovementForm({
    open,
    movement,
    companyId,
    defaultDate,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={isEditing ? "Editar movimiento" : "Nuevo movimiento USDT"}
      description="Registra un movimiento de inventario USDT."
      footer={
        <FormModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="movement-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditing ? (
              "Guardar"
            ) : (
              "Crear movimiento"
            )}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="movement-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <FormModalSection title="Operación">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="operationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha operación</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="movementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOVEMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="clientId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormModalSection>

          <FormModalSection title="Montos">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="usdtAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad USDT</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="tabular-nums"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : e.target.valueAsNumber,
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
                name="purchaseRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de compra</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            field.onChange(undefined);
                            return;
                          }
                          const value = e.target.valueAsNumber;
                          field.onChange(Number.isNaN(value) ? undefined : value);
                        }}
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
                        step="1"
                        className="tabular-nums"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            field.onChange(undefined);
                            return;
                          }
                          const value = e.target.valueAsNumber;
                          field.onChange(Number.isNaN(value) ? undefined : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormModalSection>

          <FormModalSection title="Referencias">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="walletId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cartera (opcional)</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : "none"}
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? undefined : Number(value),
                        )
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">—</SelectItem>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={String(wallet.id)}>
                            {wallet.code}
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
                    <FormLabel>Contraparte OTC (opcional)</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : "none"}
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? undefined : Number(value),
                        )
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">—</SelectItem>
                        {counterparties.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.code}
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
                name="txHash"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>TxHash (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappGroup"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Grupo WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usesCobre"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:col-span-2">
                    <FormLabel className="mb-0">Usa Cobre</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </FormModalSection>
        </form>
      </Form>
    </FormModal>
  );
}
