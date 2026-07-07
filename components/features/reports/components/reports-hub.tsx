"use client";

import Link from "next/link";
import { ChevronRight, FileBarChart2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { REPORTS } from "@/config/reports";

export function ReportsHub() {
  return (
    <div className="p-6">
      <PageHeader
        title="Informes"
        description="Reportes operativos listos para consultar y descargar en PDF, Excel o Word"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report) => {
          const content = (
            <Card
              className={`h-full transition-colors ${
                report.available
                  ? "hover:border-primary/40 hover:bg-gray-50/80"
                  : "opacity-70"
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <FileBarChart2 className="size-4 text-primary" />
                  <CardTitle className="text-base">{report.title}</CardTitle>
                </div>
                {report.available ? (
                  <ChevronRight className="size-4 text-gray-400" />
                ) : (
                  <Lock className="size-4 text-gray-400" />
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{report.description}</p>
                <p className="text-xs text-gray-500">
                  Origen Excel: {report.excelSource}
                </p>
                {!report.available ? (
                  <Badge variant="secondary">Próximamente</Badge>
                ) : (
                  <Badge>Disponible</Badge>
                )}
              </CardContent>
            </Card>
          );

          if (!report.available) {
            return (
              <div key={report.id} aria-disabled>
                {content}
              </div>
            );
          }

          return (
            <Link key={report.id} href={report.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
