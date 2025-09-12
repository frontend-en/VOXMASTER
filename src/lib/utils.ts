// src/lib/utils.ts
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function normalizeAmount(priceLabel: string) {
  // "3 000 ₽" | "11 000" | "3000,00 ₽" -> "3000.00"
  const raw = priceLabel.replace(/[^\d.,]/g, "").replace(/\s/g, "");
  const normalized = raw.replace(",", ".");
  const num = Number(normalized);
  return num.toFixed(2);
}