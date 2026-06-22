"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserMutations } from "@/components/features/users/hooks/use-user-mutations";
import {
  createUserToFormValues,
  editUserSchema,
  userSchema,
  userToFormValues,
  type EditUserFormValues,
  type UserFormValues,
} from "@/components/features/users/schemas/user.schema";
import type { UserDetail } from "@/types/users";

type UseUserFormOptions = {
  open: boolean;
  user?: UserDetail | null;
  defaultCompanyId: number;
  onSuccess?: () => void;
};

export function useUserForm({
  open,
  user,
  defaultCompanyId,
  onSuccess,
}: UseUserFormOptions) {
  const { createUser, updateUser } = useUserMutations();
  const isEditing = Boolean(user);

  const form = useForm<UserFormValues | EditUserFormValues>({
    resolver: zodResolver(isEditing ? editUserSchema : userSchema) as never,
    defaultValues: createUserToFormValues(defaultCompanyId),
  });

  useEffect(() => {
    if (!open) return;

    if (user) {
      form.reset(userToFormValues(user, defaultCompanyId));
      return;
    }

    form.reset(createUserToFormValues(defaultCompanyId));
  }, [open, user, defaultCompanyId, form]);

  async function handleSubmit(values: UserFormValues | EditUserFormValues) {
    if (user) {
      await updateUser.mutateAsync({
        id: user.id,
        values: values as EditUserFormValues,
      });
    } else {
      await createUser.mutateAsync(values as UserFormValues);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing,
    isSubmitting: form.formState.isSubmitting,
  };
}
