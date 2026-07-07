"use client";

import { useMemo, useState } from "react";
import { toDateOnlyString } from "@/lib/api/build-url";

export function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Fecha operativa local por pantalla (independiente del header). */
export function useOperationDate(initialDate: Date = startOfToday()) {
  const [operationDate, setOperationDate] = useState(initialDate);

  const operationDateString = useMemo(
    () => toDateOnlyString(operationDate),
    [operationDate],
  );

  return {
    operationDate,
    setOperationDate,
    operationDateString,
  };
}
