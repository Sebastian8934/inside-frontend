"use client";

import { useEffect } from "react";
import { INSIDE_COLORS } from "@/config/constants";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/stores/app-store";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  function closeMobileSidebar() {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: INSIDE_COLORS.content }}
    >
      {/* Desktop: sidebar empuja el contenido */}
      <div
        className={cn(
          "hidden shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out md:block",
          sidebarOpen ? "w-64" : "w-0",
        )}
      >
        <AppSidebar className="h-screen" />
      </div>

      {/* Mobile: drawer superpuesto */}
      <Sheet open={isMobile && sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 max-w-[85vw] border-none p-0 [&>button]:text-white"
          style={{ backgroundColor: INSIDE_COLORS.sidebar }}
        >
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <AppSidebar onNavigate={closeMobileSidebar} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
