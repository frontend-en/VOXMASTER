import { useCallback, useEffect, useRef, useState } from "react";
import { usePauseState } from "./usePauseState";

const AUTO_PLAY_INTERVAL = 4000;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export function useTestimonialsCarousel(
  itemCount: number,
  onBeforeChange?: () => void
) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);

  const { isPaused, pause, resume } = usePauseState();

  const viewport = useCallback(() => {
    if (viewportRef.current?.isConnected) return viewportRef.current;
    const el = scrollAreaRef.current?.querySelector<HTMLDivElement>(
      "[data-radix-scroll-area-viewport]"
    );
    if (el) viewportRef.current = el;
    return el ?? null;
  }, []);

  const updateActive = (i: number) => {
    activeRef.current = i;
    setActive(i);
  };

  const measure = useCallback(() => {
    const vp = viewport();
    if (!vp) return;
    const cards = vp.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards.length) return;

    const width =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth;

    if (width > 0) {
      setCardWidth(width);
      const visible = Math.max(1, Math.floor(vp.clientWidth / width));
      const newPages = Math.max(1, itemCount - visible + 1);
      setPages(newPages);

      if (activeRef.current >= newPages) {
        updateActive(0);
        vp.scrollTo({ left: 0, behavior: "auto" });
      }
    }
  }, [viewport, itemCount]);

  const goTo = (i: number) => {
    const vp = viewport();
    if (!vp || !cardWidth) return;

    const clamped = clamp(i, 0, pages - 1);
    onBeforeChange?.();

    const maxLeft = vp.scrollWidth - vp.clientWidth;
    vp.scrollTo({ left: Math.min(clamped * cardWidth, maxLeft), behavior: "smooth" });
    updateActive(clamped);
  };

  const prev = () => {
    if (pages <= 1) return;
    pause(true);
    goTo((activeRef.current - 1 + pages) % pages);
  };

  const next = () => {
    if (pages <= 1) return;
    pause(true);
    goTo((activeRef.current + 1) % pages);
  };

  useEffect(() => {
    measure();
    const vp = viewport();
    if (!vp) return;

    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [viewport, measure]);

  useEffect(() => {
    if (isPaused || cardWidth <= 0 || pages <= 1) return;
    let id: ReturnType<typeof setTimeout>;
    const loop = () => {
      id = window.setTimeout(() => {
        goTo((activeRef.current + 1) % pages);
        loop();
      }, AUTO_PLAY_INTERVAL);
    };
    loop();
    return () => clearTimeout(id);
  }, [cardWidth, pages, isPaused]);

  useEffect(() => {
    const vp = viewport();
    if (!vp || !cardWidth) return;
    let tid: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(tid);
      tid = window.setTimeout(() => {
        updateActive(clamp(Math.round(vp.scrollLeft / cardWidth), 0, pages - 1));
      }, 120);
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      vp.removeEventListener("scroll", onScroll);
      clearTimeout(tid);
    };
  }, [viewport, cardWidth, pages]);

  return { scrollAreaRef, active, pages, prev, next, pause, resume, goTo };
}
