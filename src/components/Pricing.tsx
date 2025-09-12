import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, CreditCard, HelpCircle } from "lucide-react";
import { PRICING_COPY } from "../lib/consts";
import { normalizeAmount } from "../lib/utils";

const API_BASE = "https://nextjs-boilerplate-liard-omega-74.vercel.app";

export function Pricing() {
  const [isPaying, setIsPaying] = useState(false);

  const handlePaymentClick = async (planTitle: string, planPrice: string) => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const amount = normalizeAmount(planPrice);
      const { data } = await axios.post(
        `${API_BASE}/api/create-payment`,
        {
          amount, // "3000.00" | "11000.00"
          description: planTitle, // "1 урок" | "Пакет 4 занятия"
          returnUrl: window.location.origin + "/thank-you.html",
          // опционально: попадёт в YooKassa -> потом в вебхук/телеграм
          metadata: { planTitle, source: "voxcraft.studio" },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const url = data?.confirmation?.confirmation_url;
      if (url) {
        window.location.assign(url); // редирект на YooKassa
      } else {
        alert("Не удалось получить ссылку на оплату");
      }
    } catch (e: any) {
      console.error(e);
      alert("Ошибка при создании платежа");
    } finally {
      setIsPaying(false);
    }
  };

  const scrollToBook = () =>
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      className="py-8 px-4 md:py-8 lg:py-8"
      style={{ paddingTop: "calc(var(--header-height-mobile) + 24px)" }}
    >
      <div className="max-w-6xl mx-auto pricing-section">
        {/* Кикер и заголовок */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
            {PRICING_COPY.kicker}
          </div>
          <h2 className="mb-4">{PRICING_COPY.heading}</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            {PRICING_COPY.lead}
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
          {PRICING_COPY.lessons.map((lesson, i) => (
            <Card
              key={lesson.title}
              className={[
                "relative h-full rounded-[18px]",
                lesson.featured
                  ? "border-2 border-primary shadow-lg"
                  : "border border-border",
                lesson.className || "",
              ].join(" ")}
            >
              {lesson.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Рекомендация
                  </Badge>
                </div>
              )}

              <CardHeader className={lesson.featured ? "pt-6" : undefined}>
                <CardTitle>{lesson.title}</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{lesson.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lesson.durationHint}
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-3 text-foreground">
                    Что входит:
                  </h4>
                  <ul className="space-y-2.5">
                    {lesson.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {lesson.footnote && (
                  <p className="text-xs text-muted-foreground italic">
                    {lesson.footnote}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    className="w-full min-h-[44px]"
                    onClick={() =>
                      handlePaymentClick(lesson.title, lesson.price)
                    }
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Оплатить урок
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px]"
                    onClick={scrollToBook}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Спросить об оплате
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Примечания */}
        <div className="bg-muted/20 rounded-lg p-4 md:mb-12 mb-8 md:p-6 border border-border/50">
          <h4 className="font-medium mb-3 text-foreground">
            {PRICING_COPY.notesTitle}
          </h4>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {PRICING_COPY.notes.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </div>
        </div>

        {/* Пакеты */}
        <div className="bg-muted/30 rounded-[18px] p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="mb-3 md:mb-4 mx-auto">
              {PRICING_COPY.packsBlock.heading}
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
              {PRICING_COPY.packsBlock.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {PRICING_COPY.packsBlock.packs.map((p) => (
              <div
                key={p.title}
                className="bg-background rounded-[18px] p-4 sm:p-5 md:p-6 border border-border shadow-sm"
              >
                <div className="mb-4 sm:mb-5">
                  <h4 className="mb-2">{p.title}</h4>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-bold">
                      {p.price}
                    </span>
                    {p.saveNote && (
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {p.saveNote}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </div>

                <div className="mb-5 sm:mb-6">
                  <h5 className="text-sm font-medium mb-3 text-foreground">
                    Что получите:
                  </h5>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2.5 sm:gap-3">
                  <Button
                    className="w-full min-h-[44px]"
                    onClick={() => handlePaymentClick(p.title, p.price)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span className="sm:hidden">Выбрать</span>
                    <span className="hidden sm:inline">Выбрать {p.title}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full min-h-[44px]"
                    onClick={scrollToBook}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span className="sm:hidden">Записаться</span>
                    <span className="hidden sm:inline">
                      Записаться без оплаты
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 text-center px-2 sm:px-0">
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto whitespace-pre-line">
              {PRICING_COPY.packsBlock.footnote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
