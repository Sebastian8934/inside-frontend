import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PagePlaceholderProps = {
  title: string;
  description: string;
  phase?: string;
  embedded?: boolean;
};

export function PagePlaceholder({
  title,
  description,
  phase = "Fase 3",
  embedded = false,
}: PagePlaceholderProps) {
  const content = (
    <>
      {!embedded ? (
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      ) : null}

      <Card className="max-w-xl">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <Construction className="size-5 text-primary" />
            <CardTitle className="text-lg">
              {embedded ? title : "Módulo en construcción"}
            </CardTitle>
          </div>
          <CardDescription>
            {embedded
              ? description
              : `La navegación y el diseño ya están listos. Los datos reales del API se conectarán en ${phase}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Próximamente — {phase}</Badge>
        </CardContent>
      </Card>
    </>
  );

  if (embedded) {
    return content;
  }

  return <div className="p-6">{content}</div>;
}
