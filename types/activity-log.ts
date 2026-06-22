export type ActivityLogListItem = {
  id: number;
  companyId: number;
  activityType: string;
  description: string;
  referenceEntity: string | null;
  referenceId: number | null;
  createdByUserId: string | null;
  createdAt: string;
};

export type CreateActivityLogPayload = {
  activityType: string;
  description: string;
  referenceEntity?: string | null;
  referenceId?: number | null;
  companyId?: number | null;
};

export const COMMON_ACTIVITY_TYPES = [
  "Nota",
  "Alerta",
  "Revisión",
  "Cierre",
  "Ajuste",
  "Seguimiento",
] as const;
