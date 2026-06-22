import { Suspense } from "react";
import { ActivityLogPageContent } from "@/components/features/activity-log/activity-log-page-content";
import { LoadingState } from "@/components/shared/data-states";

export default function AuditoriaPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando auditoría..." />}>
      <ActivityLogPageContent />
    </Suspense>
  );
}
