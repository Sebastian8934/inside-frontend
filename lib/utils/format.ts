const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const usdtFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCop(value: number) {
  return copFormatter.format(value);
}

export function formatUsdt(value: number) {
  return `${usdtFormatter.format(value)} USDT`;
}

export function formatDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleDateString("es-CO");
}

export function formatDateOnly(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function truncateHash(hash: string, start = 8, end = 6) {
  if (!hash || hash.length <= start + end + 3) return hash;
  return `${hash.slice(0, start)}…${hash.slice(-end)}`;
}

export function usdtColorClass(value: number) {
  if (value < 0) return "text-red-600";
  if (value > 0) return "text-green-600";
  return "text-gray-900";
}
