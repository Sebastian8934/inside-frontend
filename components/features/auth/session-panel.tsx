"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/config/constants";
import { getRoleLabel } from "@/config/roles";
import { logoutSession } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/stores/auth-store";

export function SessionPanel() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

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

  if (!user) return null;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{APP_NAME}</CardTitle>
        <CardDescription>Sesión activa — Fase 1 completada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Usuario: </span>
            {user.fullName}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {user.email}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {user.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {getRoleLabel(role)}
              </Badge>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </CardContent>
    </Card>
  );
}
