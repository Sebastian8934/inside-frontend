import { AuthGuard } from "@/components/auth/auth-guard";
import { RouteGuard } from "@/components/auth/route-guard";
import { SessionMonitor } from "@/components/auth/session-monitor";
import { AppShell } from "@/components/layout/app-shell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SessionMonitor />
      <RouteGuard>
        <AppShell>{children}</AppShell>
      </RouteGuard>
    </AuthGuard>
  );
}
