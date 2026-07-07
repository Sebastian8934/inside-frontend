"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
  label?: string;
  className?: string;
};

export function OperationDateFilter({
  date,
  onDateChange,
  label = "Fecha operativa",
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <Label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full justify-start gap-2 sm:w-auto"
          >
            <Calendar className="size-4 shrink-0 text-gray-500" />
            <span className="tabular-nums">
              {format(date, "dd/MM/yyyy", { locale: es })}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                onDateChange(newDate);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
