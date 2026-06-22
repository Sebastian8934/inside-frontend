"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useClientMutations } from "@/components/features/catalogs/clients/hooks/use-client-mutations";
import {
  clientDefaultValues,
  clientSchema,
  clientToFormValues,
  type ClientFormValues,
} from "@/components/features/catalogs/clients/schemas/client.schema";
import type { Client } from "@/types/catalogs";

type UseClientFormOptions = {
  open: boolean;
  client?: Client | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useClientForm({
  open,
  client,
  companyId,
  onSuccess,
}: UseClientFormOptions) {
  const { createClient, updateClient } = useClientMutations(companyId);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (client) {
      form.reset(clientToFormValues(client));
      return;
    }

    form.reset(clientDefaultValues);
  }, [open, client, form]);

  async function handleSubmit(values: ClientFormValues) {
    if (client) {
      await updateClient.mutateAsync({ id: client.id, values });
    } else {
      await createClient.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(client),
    isSubmitting: form.formState.isSubmitting,
  };
}
