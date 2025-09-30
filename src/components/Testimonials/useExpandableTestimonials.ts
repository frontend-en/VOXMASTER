import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Хук для управления состоянием "Показать полный текст" в карточках отзывов
 * - измеряет переполнение текста (через ResizeObserver + scrollHeight)
 * - хранит массив expanded[] для каждой карточки
 * - предоставляет toggle/reset
 */
export function useExpandableTestimonials(count: number) {
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [expanded, setExpanded] = useState<boolean[]>(Array(count).fill(false));
  const [needsToggle, setNeedsToggle] = useState<boolean[]>(Array(count).fill(false));

  /** Проверка: нужно ли показывать кнопку "Показать полный текст" */
  const measure = useCallback(() => {
    setNeedsToggle(
      Array.from({ length: count }, (_, i) => {
        const el = refs.current[i];
        if (!el) return false;
        return el.scrollHeight > el.clientHeight + 1;
      })
    );
  }, [count]);

  /** Следим за изменениями размера текста */
  useEffect(() => {
    measure();
    const observers = refs.current.map((el) => {
      if (!el) return null;
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return ro;
    });
    window.addEventListener("resize", measure);
    return () => {
      observers.forEach((ro) => ro?.disconnect());
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /** Переключить состояние конкретной карточки */
  const toggle = (i: number) =>
    setExpanded((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  /** Сбросить все карточки */
  const reset = () => setExpanded(Array(count).fill(false));

  return { refs, expanded, needsToggle, toggle, reset };
}
