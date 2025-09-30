import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { testimonials } from "../../lib/consts";
import { useTestimonialsCarousel } from "./useTestimonialsCarousel";
import { useExpandableTestimonials } from "./useExpandableTestimonials";

export function Testimonials() {
  const [showAll, setShowAll] = useState(false);

  // управляем обрезкой/раскрытием текста в карточках
  const { refs, expanded, needsToggle, toggle, reset } =
    useExpandableTestimonials(testimonials.length);

  // слайдер только для mobile/tablet; при смене слайда сворачиваем тексты
  const {
    scrollAreaRef,
    active,
    pages,
    prev,
    next,
    pause,
    resume,
    goTo,
  } = useTestimonialsCarousel(testimonials.length, reset);

  return (
    <section className="py-8 lg:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="mb-4">Отзывы учеников</h2>
          <p className="text-muted-foreground">Что говорят о занятиях мои ученики</p>
        </div>

{/* Mobile/Tablet slider */}
<div className="lg:hidden">
  <div
    ref={scrollAreaRef}
    onMouseEnter={() => pause(false)}
    onMouseLeave={resume}
    className="mx-auto px-2"
  >
    <ScrollArea className="w-full">
      <div className="flex space-x-6 pb-4">
        {testimonials.map((t, i) => (
          <Card
            key={`${t.name}-${i}`}
            data-card
            className="flex-shrink-0 w-[80%] sm:w-[60%] max-w-md"
          >
            <CardContent className="p-6">
              <div className="flex gap-1.5 mb-3">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star
                    key={si}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`text-sm leading-relaxed ${
                  expanded[i] ? "" : "line-clamp-5"
                }`}
              >
                {t.text}
              </p>

              {(needsToggle[i] || expanded[i]) && (
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="mt-2 text-sm text-primary flex items-center gap-1"
                >
                  {expanded[i] ? (
                    <>
                      Скрыть <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Показать полный текст{" "}
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}

              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>{t.name}</span>
                <span>{t.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  </div>

  {/* Навигация */}
  {pages > 1 && (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div
        className="inline-flex items-center gap-3"
        role="group"
        aria-label="Навигация отзывов"
      >
        <button
          type="button"
          onClick={prev}
          className="h-10 px-4 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition"
          aria-label="Предыдущий отзыв"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="h-10 px-4 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition"
          aria-label="Следующий отзыв"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Пагинация — показываем только начиная с tablet */}
      <div className="hidden sm:flex items-center gap-2">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              pause(true);
              goTo(i);
            }}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === active ? "bg-primary" : "bg-border"
            }`}
            aria-label={`Страница ${i + 1}`}
            aria-current={i === active}
          />
        ))}
      </div>
    </div>
  )}
</div>

        {/* Desktop grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAll ? testimonials : testimonials.slice(0, 6)).map((t, i) => (
              <Card key={`${t.name}-${i}`}>
                <CardContent className="p-6">
                  <div className="flex gap-1.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star
                        key={si}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className={`text-sm leading-relaxed transition-all duration-300 ${
                      expanded[i] ? "" : "line-clamp-6"
                    }`}
                  >
                    {t.text}
                  </p>

                  {(needsToggle[i] || expanded[i]) && (
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className="mt-2 text-sm text-primary flex items-center gap-1"
                    >
                      {expanded[i] ? (
                        <>
                          Скрыть <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Показать полный текст <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}

                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>{t.name}</span>
                    <span>{t.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Кнопка "Показать все" */}
          {testimonials.length > 6 && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="text-primary flex items-center gap-1 mx-auto"
              >
                {showAll ? (
                  <>
                    Скрыть <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Показать все <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
