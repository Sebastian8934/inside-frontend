"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATALOG_TYPE_LIST, CATALOG_TYPES } from "@/config/catalogs";
import { cn } from "@/lib/utils/cn";

export function CatalogSubNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {CATALOG_TYPE_LIST.map((tipo) => {
        const href = `/catalogos/${tipo}`;
        const isActive = pathname === href;

        return (
          <Link
            key={tipo}
            href={href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {CATALOG_TYPES[tipo].title}
          </Link>
        );
      })}
    </div>
  );
}
