"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createUserApi,
  deactivateUserApi,
  updateUserApi,
} from "@/components/features/users/api/users.api";
import type {
  EditUserFormValues,
  UserFormValues,
} from "@/components/features/users/schemas/user.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";

export function useUserMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  };

  const createMutation = useMutation({
    mutationFn: (values: UserFormValues) =>
      createUserApi({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        companyId: values.companyId,
        role: values.role,
      }),
    onSuccess: () => {
      toast.success("Usuario creado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: EditUserFormValues;
    }) =>
      updateUserApi(id, {
        fullName: values.fullName,
        companyId: values.companyId,
        role: values.role,
        isActive: values.isActive ?? true,
      }),
    onSuccess: () => {
      toast.success("Usuario actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUserApi,
    onSuccess: () => {
      toast.success("Usuario desactivado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createUser: createMutation,
    updateUser: updateMutation,
    deactivateUser: deactivateMutation,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deactivateMutation.isPending,
  };
}
