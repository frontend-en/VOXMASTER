import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import Star from "lucide-react/dist/esm/icons/star";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import ChevronUp from "lucide-react/dist/esm/icons/chevron-up";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { testimonials } from "../lib/consts";

export function Testimonials() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Состояние для отслеживания развернутых комментариев
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

      // Рефы на абзацы и флаг необходимости кнопки
    const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    const [showMoreNeeded, setShowMoreNeeded] = useState<boolean[]>(() =>
      Array(testimonials.length).fill(false)
    );

  // Получаем viewport элемент
  const getScrollArea = () => {
    return scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;
  };

  // Вычисляем актуальную ширину карточки с промежутком для экстра широких карточек
  const getCardWidth = () => {
    const scrollArea = getScrollArea();
    if (!scrollArea) {
      // Адаптивные fallback значения для экстра широких карточек
      if (window.innerWidth < 640) return Math.max(350, window.innerWidth - 16); // Mobile: минимум 350px
      if (window.innerWidth < 768) return 674; // 650px + 24px gap
      if (window.innerWidth < 1024) return 704; // 680px + 24px gap
      if (window.innerWidth < 1280) return 744; // 720px + 24px gap
      if (window.innerWidth < 1440) return 774; // 750px + 24px gap
      return 774; // 750px + 24px gap для больших экранов
    }

    const cards = scrollArea.querySelectorAll("[data-card]");
    if (cards.length > 1) {
      const firstCard = cards[0] as HTMLElement;
      const secondCard = cards[1] as HTMLElement;
      return secondCard.offsetLeft - firstCard.offsetLeft;
    }

    // Fallback с адаптивностью
    if (window.innerWidth < 640) return Math.max(350, window.innerWidth - 16);
    if (window.innerWidth < 768) return 674;
    if (window.innerWidth < 1024) return 704;
    if (window.innerWidth < 1280) return 744;
    if (window.innerWidth < 1440) return 774;
    return 774;
  };

  // Общее количество страниц для экстра широких карточек
  const getTotalPages = () => {
    const scrollArea = getScrollArea();
    const totalCards = testimonials.length;



    if (!scrollArea) {
      // Fallback в зависимости от размера экрана для экстра широких карточек
      if (window.innerWidth < 640) return totalCards; // Mobile: по 1 карточке
      if (window.innerWidth < 768) return Math.max(1, totalCards); // Tablet: 1.2 карточки
      if (window.innerWidth < 1024) return Math.max(1, totalCards); // Desktop: 1.3 карточки
      if (window.innerWidth < 1280) return Math.max(1, totalCards); // Large: 1.4 карточки
      if (window.innerWidth < 1440) return Math.max(1, totalCards); // XL: 1.6 карточки
      return Math.max(1, totalCards); // Ultra: 1.8 карточки
    }

    const containerWidth = scrollArea.clientWidth;
    const cardWidth = getCardWidth();

    if (cardWidth === 0 || containerWidth === 0) {
      return Math.max(1, totalCards);
    }

    // Вычисляем точное количество видимых карточек
    const exactVisibleCards = containerWidth / cardWidth;

    // Mobile: если помещается менее 1.05 карточек, показываем по одной
    if (exactVisibleCards < 1.05) {
      return totalCards;
    }

    // Для экстра широких карточек: обычно показываем только 1 полную карточку плюс часть следующей
    const fullyVisibleCards = Math.floor(exactVisibleCards);
    const pages = Math.max(1, totalCards - fullyVisibleCards + 1);

    // Ограничиваем максимальное количество страниц
    return Math.min(pages, totalCards);
  };

  const [totalPages, setTotalPages] = useState(1); // Инициализируем с 1

  // Функция для перехода к определенной странице
  const goToSlide = (pageIndex: number) => {
    const scrollArea = getScrollArea();
    const currentTotalPages = getTotalPages();
    if (!scrollArea || pageIndex < 0 || pageIndex >= currentTotalPages) return;

    // Очищаем предыдущий таймаут
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    resetExpandedState();
    setIsPaused(true); // как было
    setActiveSlide(pageIndex);

    // Ставим автопрокрутку на паузу
    setIsPaused(true);

    // Мгновенно обновляем состояние для UI
    setActiveSlide(pageIndex);

    const cardWidth = getCardWidth();

    // Для 1.5 карточек: каждый шаг = ширина одной карточки
    const targetPosition = pageIndex * cardWidth;
    const maxScrollLeft = scrollArea.scrollWidth - scrollArea.clientWidth;
    const newPosition = Math.min(targetPosition, maxScrollLeft);

    resetExpandedState();

    scrollArea.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    // Возобновляем автопрокрутку через 6 секунд после клика
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 7000);
  };

  const resetCardHeights = () => {
    const scrollArea = getScrollArea();
    if (!scrollArea) return;
    const cards = scrollArea.querySelectorAll<HTMLElement>("[data-card]");
    cards.forEach((card) => {
      card.style.height = "";
      card.style.maxHeight = "";
      card.removeAttribute("data-expanded");
    });
  };

  // Унифицированный сброс «разворотов» + высот
  const resetExpandedState = () => {
    setExpandedComments(new Set()); // свернуть все отзывы
    resetCardHeights(); // очистить инлайновые размеры
  };

  // Обновляем активную страницу при изменении позиции скролла
  const updateActiveSlide = (scrollLeft: number) => {
    if (isPaused) return;

    const cardWidth = getCardWidth();
    const currentTotalPages = getTotalPages();
    const currentPage = Math.round(scrollLeft / cardWidth);
    const newActiveSlide = Math.max(
      0,
      Math.min(currentPage, currentTotalPages - 1)
    );

    if (newActiveSlide !== activeSlide) {
      // СБРОС при смене страницы вручную
      resetExpandedState();
      setActiveSlide(newActiveSlide);
    }
  };

  // Автопрокрутка
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const scrollArea = getScrollArea();
      if (!scrollArea) return;

      const cardWidth = getCardWidth();
      const currentTotalPages = getTotalPages();
      const maxScrollLeft = scrollArea.scrollWidth - scrollArea.clientWidth;

      if (currentTotalPages !== totalPages) {
        setTotalPages(currentTotalPages);
      }

      const nextPageIndex = (activeSlide + 1) % currentTotalPages;
      const nextPosition = nextPageIndex * cardWidth;
      const newPosition = nextPosition >= maxScrollLeft ? 0 : nextPosition;

      // СБРОС перед перелистыванием
      resetExpandedState();

      scrollArea.scrollTo({ left: newPosition, behavior: "smooth" });
      setActiveSlide(nextPageIndex);
    }, 4000); // Прокрутка каждые 4 секунды

    return () => clearInterval(interval);
  }, [isPaused, activeSlide, totalPages]);

  // Добавляем слушатель скролла для отслеживания ручной прокрутки
  useEffect(() => {
    const scrollArea = getScrollArea();
    if (!scrollArea) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Очищаем предыдущий таймаут
      clearTimeout(scrollTimeout);

      // Обновляем активный слайд с небольшой задержкой
      scrollTimeout = setTimeout(() => {
        const scrollLeft = scrollArea.scrollLeft;
        updateActiveSlide(scrollLeft);
      }, 100);
    };

    scrollArea.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollArea.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeSlide, isPaused]);

  // Отслеживание изменений размера окна
  useEffect(() => {
    const handleResize = () => {
      // Небольшая задержка для завершения изменения размеров
      setTimeout(() => {
        const newTotalPages = getTotalPages();

        // Обновляем количество страниц
        setTotalPages(newTotalPages);

        // Сбрасываем активный слайд если он больше не валидный
        if (activeSlide >= newTotalPages) {
          setActiveSlide(0);
        }

        // Принудительно обновляем для перерендера UI и пересчета needsExpansion
        setForceUpdate((prev) => prev + 1);
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeSlide]);

  // Инициализация и обновление количества страниц при монтировании
  useEffect(() => {
    // Небольшая задержка для полной загрузки компонентов
    const timer = setTimeout(() => {
      const newTotalPages = getTotalPages();
      setTotalPages(newTotalPages);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Обновление totalPages при forceUpdate
  useEffect(() => {
    const newTotalPages = getTotalPages();
    if (newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }
  }, [forceUpdate]);

  useEffect(() => {
    const measure = () => {
      setShowMoreNeeded(
        testimonials.map((_, i) => {
          const el = textRefs.current[i];
          if (!el) return false;
          // Если line-clamp обрезал текст, то реальная высота больше видимой
          return el.scrollHeight - el.clientHeight > 1;
        })
      );
    };

    // Первая мера после рендера
    const raf = requestAnimationFrame(measure);

    // Пересчёт при ресайзе окна
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);

    // Наблюдатели за изменением размеров текста/контейнера
    const observers: ResizeObserver[] = [];
    textRefs.current.forEach((el) => {
      if (!el) return;
      const ro = new ResizeObserver(() => measure());
      ro.observe(el);
      observers.push(ro);
    });

    // На случай поздней догрузки шрифтов и картинок
    const t = setTimeout(measure, 250);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      observers.forEach((ro) => ro.disconnect());
    };
    // Пересчитываем также при смене страницы и форс-обновлениях
  }, [testimonials.length, activeSlide, forceUpdate, expandedComments]);

  // Очистка таймаутов при размонтировании
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // Обработчик клавиатурной навигации
  const handleKeyDown = (event: KeyboardEvent, slideIndex: number) => {
    const currentTotalPages = getTotalPages();

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToSlide(slideIndex);
    }

    // Навигация стрелками
    if (event.key === "ArrowLeft" && slideIndex > 0) {
      event.preventDefault();
      goToSlide(slideIndex - 1);
    }

    if (event.key === "ArrowRight" && slideIndex < currentTotalPages - 1) {
      event.preventDefault();
      goToSlide(slideIndex + 1);
    }
  };

  // Обработчики для паузы при наведении
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Функция для переключения состояния развернутого комментария
  const toggleComment = (index: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      const wasExpanded = newSet.has(index);
      const scrollArea = getScrollArea();
      const card =
        scrollArea?.querySelectorAll<HTMLElement>("[data-card]")?.[index];
      if (card) {
        if (wasExpanded) {
          card.removeAttribute("data-expanded");
          card.style.maxHeight = ""; // если анимировали
        } else {
          card.setAttribute("data-expanded", "true");
          card.style.maxHeight = ""; // анимация «до auto» — если используете
        }
      }
      if (wasExpanded) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // ниже остальных хуков
  const handlePrev = () => {
    const pages = getTotalPages();
    const prev = (activeSlide - 1 + pages) % pages;
    goToSlide(prev);
  };

  const handleNext = () => {
    const pages = getTotalPages();
    const next = (activeSlide + 1) % pages;
    goToSlide(next);
  };

  return (
    <section className="py-8 lg:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="mb-4 mx-auto">Отзывы учеников</h2>
          <p className="text-muted-foreground mx-auto">
            Что говорят о занятиях мои ученики
          </p>
        </div>

        <div
          ref={scrollAreaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="testimonials-container mx-auto px-2" // Адаптивная ширина для экстра широких карточек
        >
          <ScrollArea className="w-full">
            <div className="flex space-x-6 pb-4">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  data-card
                  className="testimonial-card flex-shrink-0"
                >
                  <CardContent className="p-8 sm:p-9 md:p-10 testimonial-card-content">
                    <div className="flex items-center gap-1.5 mb-5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <div className="testimonial-text">
                      <div className="mb-6 ml-2">
                        <p
                          id={`testimonial-text-${index}`}
                          ref={(el) => { textRefs.current[index] = el; }}
                          className={`text-base text-sm lg:text-lg leading-relaxed ${
                            expandedComments.has(index) ? "" : "line-clamp-4"
                          }`}
                        >
                          {testimonial.text}
                        </p>

                        {/* Кнопка показать больше/меньше */}
                        {(showMoreNeeded[index] ||
                          expandedComments.has(index)) && (
                          <button
                            onClick={() => toggleComment(index)}
                            className="testimonial-expand-btn mt-3 text-sm text-primary hover:text-primary/80 focus:text-primary/80 transition-colors duration-200 flex items-center gap-2 group !mx-3"
                            aria-expanded={expandedComments.has(index)}
                            aria-controls={`testimonial-text-${index}`}
                            aria-label={
                              expandedComments.has(index)
                                ? "Скрыть полный текст отзыва"
                                : "Показать полный текст отзыва"
                            }
                          >
                            {expandedComments.has(index) ? (
                              <>
                                Показать меньше
                                <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                              </>
                            ) : (
                              <>
                                Показать больше
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-sm lg:text-lg  text-muted-foreground mt-auto pt-5 border-t border-border/30">
                        <span>{testimonial.name}</span>
                        <span>{testimonial.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Навигация стрелками снизу */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex justify-center">
            <div
              className="inline-flex items-center gap-3"
              role="group"
              aria-label="Навигация отзывов"
            >
              <button
                type="button"
                onClick={handlePrev}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    handlePrev();
                  }
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    handleNext();
                  }
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePrev();
                  }
                }}
                className="
          h-11 px-4 rounded-full border border-border/60 bg-background/70
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          active:scale-95 transition
        "
                aria-label="Предыдущий отзыв"
              >
                <span className="sr-only">Назад</span>
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    handleNext();
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    handlePrev();
                  }
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                className="
          h-11 px-4 rounded-full border border-border/60 bg-background/70
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          active:scale-95 transition
        "
                aria-label="Следующий отзыв"
              >
                <span className="sr-only">Вперёд</span>
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
