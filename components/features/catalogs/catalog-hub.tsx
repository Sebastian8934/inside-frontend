"use client";

import Link from "next/link";
import { ChevronRight, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATALOG_TYPE_LIST, CATALOG_TYPES } from "@/config/catalogs";
import { PageHeader } from "@/components/shared/page-header";

export function CatalogHub() {
  return (
    <div className="p-6">
      <PageHeader
        title="Catálogos"
        description="Maestros de datos operativos y de configuración"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CATALOG_TYPE_LIST.map((tipo) => {
          const meta = CATALOG_TYPES[tipo];

          return (
            <Link key={tipo} href={`/catalogos/${tipo}`}>
              <Card className="h-full transition-colors hover:border-primary/40 hover:bg-gray-50/80">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Database className="size-4 text-primary" />
                    <CardTitle className="text-base">{meta.title}</CardTitle>
                  </div>
                  <ChevronRight className="size-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{meta.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
