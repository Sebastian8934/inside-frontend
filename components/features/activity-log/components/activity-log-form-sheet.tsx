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
import { Textarea } from "@/components/ui/textarea";
import { useActivityLogForm } from "@/components/features/activity-log/hooks/use-activity-log-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { COMMON_ACTIVITY_TYPES } from "@/types/activity-log";

type ActivityLogFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActivityLogFormSheet({
  open,
  onOpenChange,
}: ActivityLogFormSheetProps) {
  const companyId = useActiveCompanyId();

  const { form, handleSubmit, isSubmitting } = useActivityLogForm({
    open,
    companyId,
    onSuccess: () => onOpenChange(false),
  });

  const activityType = form.watch("activityType");

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title="Registrar actividad"
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
            form="activity-log-form"
            disabled={isSubmitting}
          >
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
          id="activity-log-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="activityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COMMON_ACTIVITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Otro…</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {activityType === "custom" ? (
            <FormField
              control={form.control}
              name="customType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo personalizado</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={50} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea {...field} maxLength={500} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenceEntity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entidad referencia (opcional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    maxLength={50}
                    placeholder="Ej. NegotiationLine"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID referencia (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="tabular-nums"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : e.target.valueAsNumber,
                      )
                    }
                  />
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
