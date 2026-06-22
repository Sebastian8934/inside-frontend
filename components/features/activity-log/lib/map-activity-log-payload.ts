import type { ActivityLogFormValues } from "@/components/features/activity-log/schemas/activity-log.schema";
import { resolveActivityType } from "@/components/features/activity-log/schemas/activity-log.schema";
import type { CreateActivityLogPayload } from "@/types/activity-log";

export function toCreateActivityLogPayload(
  values: ActivityLogFormValues,
  companyId: number,
): CreateActivityLogPayload {
  return {
    activityType: resolveActivityType(values),
    description: values.description.trim(),
    referenceEntity: values.referenceEntity?.trim() || null,
    referenceId: values.referenceId ?? null,
    companyId,
  };
}
