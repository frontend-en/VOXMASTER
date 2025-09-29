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
export function scrollToElementById(
  id: string,
  options: ScrollIntoViewOptions & { offset?: number } = {}
) {
  if (typeof document === "undefined" || !id) return
  const element = document.getElementById(id)
  if (!element) return

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const { offset, behavior = prefersReducedMotion ? "auto" : "smooth", block = "start", inline = "nearest" } = options

  if (offset && typeof window !== "undefined") {
    const rect = element.getBoundingClientRect()
    const top = rect.top + window.scrollY - offset
    window.scrollTo({ top, behavior })
    return
  }

  element.scrollIntoView({ behavior, block, inline })
}
