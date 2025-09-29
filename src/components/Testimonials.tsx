import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
} from "react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Star,
} from "lucide-react";
import { testimonials } from "../lib/consts";

const AUTO_PLAY_INTERVAL = 4000;
const AUTO_RESUME_DELAY = 7000;



const TESTIMONIALS_COPY = {
  heading: "Отзывы учеников",
  subheading: "Что говорят о занятиях мои ученики",
  toggle: {
    expand: "Показать больше",
    collapse: "Показать меньше",
    ariaExpand: "Показать полный текст отзыва",
    ariaCollapse: "Скрыть полный текст отзыва",
  },
  navigation: {
    group: "Навигация отзывов",
    prevLabel: "Предыдущий отзыв",
    nextLabel: "Следующий отзыв",
    prevSr: "Назад",
    nextSr: "Вперёд",
    pagePrefix: "Показать отзывы страница ",
  },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type CarouselOptions = {
  onBeforeChange?: () => void;
};

type UseCarouselResult = {
  scrollAreaRef: RefObject<HTMLDivElement>;
  activeSlide: number;
  totalPages: number;
  handlePrev: () => void;
  handleNext: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  goToSlide: (index: number) => void;
  pauseTemporarily: () => void;
};

function useTestimonialsCarousel(
  itemCount: number,
  options: CarouselOptions = {}
): UseCarouselResult {
  const { onBeforeChange } = options;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activeSlideRef = useRef(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const ensureViewport = useCallback(() => {
    if (viewportRef.current && viewportRef.current.isConnected) {
      return viewportRef.current;
    }

    const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>(
      "[data-radix-scroll-area-viewport]"
    );

    if (viewport) {
      viewportRef.current = viewport;
    }

    return viewport ?? null;
  }, []);

  const updateActiveSlide = useCallback((index: number) => {
    activeSlideRef.current = index;
    setActiveSlide(index);
  }, []);

  const measure = useCallback(() => {
    const viewport = ensureViewport();
    if (!viewport) return;

    const cards = viewport.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards.length) return;

    const width =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth;

    if (width > 0) {
      setCardWidth((prev) => (Math.abs(prev - width) < 1 ? prev : width));
      const exactVisible = viewport.clientWidth / width;
      const visibleWhole = Math.max(1, Math.floor(exactVisible));
      const pages = Math.max(1, itemCount - visibleWhole + 1);
      setTotalPages((prev) => (prev === pages ? prev : pages));

      if (activeSlideRef.current >= pages) {
        updateActiveSlide(0);
        viewport.scrollTo({ left: 0, behavior: "auto" });
      }
    }
  }, [ensureViewport, itemCount, updateActiveSlide]);

  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
      resumeTimeoutRef.current = null;
    }, AUTO_RESUME_DELAY);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      const viewport = ensureViewport();
      if (!viewport || !cardWidth || !totalPages) return;

      const clamped = clamp(index, 0, totalPages - 1);
      if (onBeforeChange) onBeforeChange();

      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
      const target = Math.min(clamped * cardWidth, maxScrollLeft);

      updateActiveSlide(clamped);
      viewport.scrollTo({ left: target, behavior: "smooth" });
    },
    [cardWidth, ensureViewport, onBeforeChange, totalPages, updateActiveSlide]
  );

  const handlePrev = useCallback(() => {
    if (totalPages <= 1) return;
    pauseTemporarily();
    const prev = (activeSlideRef.current - 1 + totalPages) % totalPages;
    goToSlide(prev);
  }, [goToSlide, pauseTemporarily, totalPages]);

  const handleNext = useCallback(() => {
    if (totalPages <= 1) return;
    pauseTemporarily();
    const next = (activeSlideRef.current + 1) % totalPages;
    goToSlide(next);
  }, [goToSlide, pauseTemporarily, totalPages]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    measure();
    const viewport = ensureViewport();
    if (!viewport) return;

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(viewport);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ensureViewport, measure]);

  useEffect(() => {
    if (isPaused || cardWidth <= 0 || totalPages <= 1) return;

    const interval = window.setInterval(() => {
      const next = (activeSlideRef.current + 1) % totalPages;
      goToSlide(next);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(interval);
  }, [cardWidth, goToSlide, isPaused, totalPages]);

  useEffect(() => {
    const viewport = ensureViewport();
    if (!viewport || cardWidth <= 0) return;

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        const next = Math.round(viewport.scrollLeft / cardWidth);
        updateActiveSlide(clamp(next, 0, Math.max(totalPages - 1, 0)));
      }, 120);
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [cardWidth, ensureViewport, totalPages, updateActiveSlide]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollAreaRef,
    activeSlide,
    totalPages,
    handlePrev,
    handleNext,
    handleMouseEnter,
    handleMouseLeave,
    goToSlide,
    pauseTemporarily,
  };
}

type ExpandableState = {
  textRefs: React.MutableRefObject<(HTMLParagraphElement | null)[]>;
  expanded: Set<number>;
  showMoreNeeded: boolean[];
  toggle: (index: number) => void;
  reset: () => void;
};

function useExpandableTestimonials(count: number): ExpandableState {
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showMoreNeeded, setShowMoreNeeded] = useState<boolean[]>(() =>
    Array(count).fill(false)
  );

  const measure = useCallback(() => {
    setShowMoreNeeded(
      Array.from({ length: count }, (_, index) => {
        const node = textRefs.current[index];
        if (!node) return false;
        return node.scrollHeight - node.clientHeight > 1;
      })
    );
  }, [count]);

  useEffect(() => {
    measure();
    const observers: ResizeObserver[] = [];

    textRefs.current.slice(0, count).forEach((node) => {
      if (!node) return;
      const observer = new ResizeObserver(() => measure());
      observer.observe(node);
      observers.push(observer);
    });

    window.addEventListener("resize", measure);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener("resize", measure);
    };
  }, [count, measure]);

  useEffect(() => {
    measure();
  }, [expanded, measure]);

  const toggle = useCallback((index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setExpanded(new Set());
  }, []);

  return {
    textRefs,
    expanded,
    showMoreNeeded,
    toggle,
    reset,
  };
}

export function Testimonials() {
  const {
    textRefs,
    expanded,
    showMoreNeeded,
    toggle,
    reset,
  } = useExpandableTestimonials(testimonials.length);

  const {
    scrollAreaRef,
    activeSlide,
    totalPages,
    handlePrev,
    handleNext,
    handleMouseEnter,
    handleMouseLeave,
    goToSlide,
    pauseTemporarily,
  } = useTestimonialsCarousel(testimonials.length, {
    onBeforeChange: reset,
  });

  const handleButtonKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, direction: "prev" | "next") => {
      if (
        direction === "prev" &&
        (event.key === "ArrowLeft" || event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        handlePrev();
      }
      if (
        direction === "next" &&
        (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        handleNext();
      }
    },
    [handleNext, handlePrev]
  );

  const paginationDots = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index);
  }, [totalPages]);

  return (
    <section className="py-8 lg:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="mb-4 mx-auto">{TESTIMONIALS_COPY.heading}</h2>
          <p className="text-muted-foreground mx-auto">
            {TESTIMONIALS_COPY.subheading}
          </p>
        </div>

        <div
          ref={scrollAreaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="testimonials-container mx-auto px-2"
        >
          <ScrollArea className="w-full">
            <div className="flex space-x-6 pb-4">
              {testimonials.map((testimonial, index) => {
                const isExpanded = expanded.has(index);
                const needsToggle = showMoreNeeded[index] || isExpanded;

                return (
                  <Card
                    key={`${testimonial.name}-${testimonial.date}`}
                    data-card
                    className="testimonial-card flex-shrink-0"
                  >
                    <CardContent className="p-8 sm:p-9 md:p-10 testimonial-card-content">
                      <div className="flex items-center gap-1.5 mb-5">
                        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="h-6 w-6 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      <div className="testimonial-text">
                        <div className="mb-6 ml-2">
                          <p
                            id={`testimonial-text-${index}`}
                            ref={(node) => {
                              textRefs.current[index] = node;
                            }}
                            className={`text-base text-sm lg:text-lg leading-relaxed ${
                              isExpanded ? "" : "line-clamp-4"
                            }`}
                          >
                            {testimonial.text}
                          </p>

                          {needsToggle && (
                            <button
                              type="button"
                              onClick={() => toggle(index)}
                              className="testimonial-expand-btn mt-3 text-sm text-primary hover:text-primary/80 focus:text-primary/80 transition-colors duration-200 flex items-center gap-2 group !mx-3"
                              aria-expanded={isExpanded}
                              aria-controls={`testimonial-text-${index}`}
                              aria-label={
                                isExpanded
                                  ? TESTIMONIALS_COPY.toggle.ariaCollapse
                                  : TESTIMONIALS_COPY.toggle.ariaExpand
                              }
                            >
                              {isExpanded ? (
                                <>
                                  {TESTIMONIALS_COPY.toggle.collapse}
                                  <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                                </>
                              ) : (
                                <>
                                  {TESTIMONIALS_COPY.toggle.expand}
                                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-sm lg:text-lg text-muted-foreground mt-auto pt-5 border-t border-border/30">
                          <span>{testimonial.name}</span>
                          <span>{testimonial.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-3" role="group" aria-label={TESTIMONIALS_COPY.navigation.group}>
              <button
                type="button"
                onClick={handlePrev}
                onKeyDown={(event) => handleButtonKeyDown(event, "prev")}
                className="h-11 px-4 rounded-full border border-border/60 bg-background/70 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 transition"
                aria-label={TESTIMONIALS_COPY.navigation.prevLabel}
              >
                <span className="sr-only">{TESTIMONIALS_COPY.navigation.prevSr}</span>
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                onKeyDown={(event) => handleButtonKeyDown(event, "next")}
                className="h-11 px-4 rounded-full border border-border/60 bg-background/70 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 transition"
                aria-label={TESTIMONIALS_COPY.navigation.nextLabel}
              >
                <span className="sr-only">{TESTIMONIALS_COPY.navigation.nextSr}</span>
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {paginationDots.map((dot) => (
                <button
                  key={dot}
                  type="button"
                  onClick={() => {
                    pauseTemporarily();
                    goToSlide(dot);
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    dot === activeSlide ? "bg-primary" : "bg-border"
                  }`}
                  aria-label={`${TESTIMONIALS_COPY.navigation.pagePrefix}${dot + 1}`}
                  aria-current={dot === activeSlide}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
