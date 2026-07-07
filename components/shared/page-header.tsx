type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
  filters,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {actions}
          </div>
        ) : null}
      </div>
      {filters ? (
        <div className="mt-4 flex flex-wrap items-end gap-4">{filters}</div>
      ) : null}
    </div>
  );
}
