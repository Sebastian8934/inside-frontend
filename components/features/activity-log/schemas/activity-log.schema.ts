import { z } from "zod";
import { COMMON_ACTIVITY_TYPES } from "@/types/activity-log";

const activityTypeValues = [
  ...COMMON_ACTIVITY_TYPES,
  "custom",
] as const;

export const activityLogSchema = z
  .object({
    activityType: z.enum(activityTypeValues),
    customType: z.string().max(50).optional(),
    description: z.string().trim().min(1, "La descripción es requerida").max(500),
    referenceEntity: z.string().max(50).nullable().optional(),
    referenceId: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.activityType === "custom" && !data.customType?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Indique el tipo personalizado",
        path: ["customType"],
      });
    }
  });

export type ActivityLogFormValues = z.infer<typeof activityLogSchema>;

export const activityLogDefaultValues: ActivityLogFormValues = {
  activityType: COMMON_ACTIVITY_TYPES[0],
  customType: "",
  description: "",
  referenceEntity: "",
  referenceId: null,
};

export function resolveActivityType(values: ActivityLogFormValues) {
  return values.activityType === "custom"
    ? (values.customType?.trim() ?? "")
    : values.activityType;
}
