import { notFound } from "next/navigation";
import { isCatalogType } from "@/config/catalogs";
import { CatalogPageContent } from "@/components/features/catalogs/catalog-page-content";

type CatalogPageProps = {
  params: Promise<{ tipo: string }>;
};

export default async function CatalogTypePage({ params }: CatalogPageProps) {
  const { tipo } = await params;

  if (!isCatalogType(tipo)) {
    notFound();
  }

  return <CatalogPageContent tipo={tipo} />;
}
