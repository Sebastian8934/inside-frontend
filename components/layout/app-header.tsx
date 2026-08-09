"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompanyContext } from "@/hooks/use-company-context";
import { logoutSession } from "@/lib/api/auth";
import { fetchMyPermissions } from "@/lib/api/permissions";
import { ApiError } from "@/lib/api/errors";
import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";

export function AppHeader() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUserPermissions = useAuthStore((state) => state.setUserPermissions);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setActiveCompanyId = useAppStore((state) => state.setActiveCompanyId);
  const { canSwitchCompany, data: companyContext } = useCompanyContext();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  async function handleLogout() {
    try {
      await logoutSession();
      toast.success("Sesión cerrada.");
      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo cerrar la sesión.";
      toast.error(message);
      router.replace("/login");
    }
  }

  async function handleCompanyChange(companyId: number) {
    setActiveCompanyId(companyId);
    try {
      const permissions = await fetchMyPermissions();
      setUserPermissions(permissions);
      toast.success("Empresa activa actualizada.");
    } catch {
      toast.success("Empresa activa actualizada.");
      toast.error("No se pudieron refrescar los permisos de la empresa.");
    }
  }

  return (
    <header className="border-b border-gray-400 bg-white px-3 py-2.5 sm:px-6 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Izquierda: menú */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            <Menu className="size-5" />
          </Button>
        </div>

        {/* Derecha: usuario */}
        <div className="flex shrink-0 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 max-w-[44px] gap-0 px-2 sm:max-w-none sm:gap-2 sm:px-3"
              >
                <User className="size-4 shrink-0" />
                <span className="hidden max-w-[120px] truncate sm:inline lg:max-w-[140px]">
                  {user?.fullName ?? "Usuario"}
                </span>
                <ChevronDown className="hidden size-4 shrink-0 sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <span>{user?.fullName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {canSwitchCompany ? (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Cambiar empresa
                  </DropdownMenuLabel>
                  {companyContext?.accessibleCompanies.map((company) => (
                    <DropdownMenuItem
                      key={company.id}
                      onClick={() => handleCompanyChange(company.id)}
                    >
                      <Building2 className="size-4" />
                      {company.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              ) : null}
              <DropdownMenuItem disabled>
                <User className="size-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
