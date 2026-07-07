import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  fromLabel?: string;
  toLabel?: string;
};

export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  fromLabel = "Fecha desde",
  toLabel = "Fecha hasta",
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label>{fromLabel}</Label>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-auto min-w-[10.5rem]"
        />
      </div>
      <div className="space-y-2">
        <Label>{toLabel}</Label>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-auto min-w-[10.5rem]"
        />
      </div>
    </>
  );
}
