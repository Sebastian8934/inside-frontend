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
import { InactiveConfirmSwitch } from "@/components/shared/inactive-confirm-switch";
import { Textarea } from "@/components/ui/textarea";
import { useWalletForm } from "@/components/features/catalogs/wallets/hooks/use-wallet-form";
import { useWalletPlatforms } from "@/components/features/catalogs/wallets/hooks/use-wallets-list";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { Wallet } from "@/types/catalogs";

type WalletFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  wallet?: Wallet | null;
};

export function WalletFormSheet({
  open,
  onOpenChange,
  companyId,
  wallet,
}: WalletFormSheetProps) {
  const { data: platforms = [] } = useWalletPlatforms(companyId, open);

  const { form, handleSubmit, isEditing, isSubmitting } = useWalletForm({
    open,
    wallet,
    companyId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEditing ? "Editar wallet" : "Nueva wallet"}
      footer={
        <FormModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="wallet-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Guardar"
            )}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="wallet-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Red</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="walletType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="platformId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plataforma</FormLabel>
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : Number(value))
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={String(platform.id)}>
                        {platform.name}
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
            name="usageDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uso / descripción</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    rows={2}
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referenceBalanceUsdt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saldo ref. USDT</FormLabel>
                <FormControl>
                  <Input
                    type="number"
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
          {isEditing ? (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Activa</FormLabel>
                  <FormControl>
                    <InactiveConfirmSwitch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      entityName="esta billetera"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ) : null}
        </form>
      </Form>
    </FormModal>
  );
}
