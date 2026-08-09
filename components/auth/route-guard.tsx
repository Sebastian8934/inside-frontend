"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  canAccessRoute,
  getFirstAccessibleHref,
} from "@/lib/auth/permissions";
import { useActiveModuleRoutes } from "@/hooks/use-active-module-routes";
import {
  useUserPermissions,
  useUserRoles,
} from "@/hooks/use-user-roles";
import { Button } from "@/components/ui/button";
import { logoutSession } from "@/lib/api/auth";

type RouteGuardProps = {
  children: React.ReactNode;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const userRoles = useUserRoles();
  const userPermissions = useUserPermissions();
  const { activeModuleRoutes, isLoading: modulesLoading } =
    useActiveModuleRoutes();

  const allowed = canAccessRoute(
    pathname,
    userRoles,
    userPermissions,
    activeModuleRoutes,
  );
  const fallbackHref = getFirstAccessibleHref(
    userRoles,
    userPermissions,
    activeModuleRoutes,
  );

  useEffect(() => {
    if (modulesLoading || allowed) return;

    if (fallbackHref && fallbackHref !== pathname) {
      router.replace(fallbackHref);
    }
  }, [allowed, fallbackHref, modulesLoading, pathname, router]);

  if (modulesLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (allowed) {
    return <>{children}</>;
  }

  if (fallbackHref && fallbackHref !== pathname) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm text-muted-foreground">
        No tienes acceso a esta sección (módulo inactivo o sin permiso).
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          await logoutSession();
          router.replace("/login");
        }}
      >
        Volver al login
      </Button>
    </div>
  );
}
