import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Gift, Calendar, MessageCircle } from "lucide-react";

export function FreeDiagnostic() {
  return (
    <section className="py-8 px-4 md:py-8 lg:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Центральная карточка предложения */}
        <Card className="relative border-2 border-secondary rounded-[18px] bg-secondary/5 shadow-lg">
          {/* Декоративный badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-secondary text-secondary-foreground px-4 py-1">
              <Gift className="mr-1.5 h-3.5 w-3.5" />
              Бесплатно
            </Badge>
          </div>

          <CardHeader className="text-center pt-8 pb-6">
            <CardTitle className="text-2xl md:text-3xl mb-3">
              Бесплатная диагностика вокальных данных
            </CardTitle>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Узнайте свои сильные стороны и зоны роста за 20-30 минут. Никаких
              обязательств — просто честная оценка ваших возможностей.
            </p>
          </CardHeader>

          <CardContent className="pb-8">
            {/* Что входит в диагностику */}
            <div className="mb-8">
              <h4 className="text-center mb-6 font-medium text-foreground">
                Что вы получите:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Анализ текущего уровня техники дыхания
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Оценка диапазона и тембральных особенностей
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Выявление индивидуальных зажимов и блоков
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Рекомендации по развитию голоса
                  </span>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Персональный план развития на 3-6 месяцев
                  </span>
                </div>
              </div>
            </div>

            {/* CTA кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Button
                size="lg"
                className="flex-1 min-h-[48px] bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={() => {
                  document
                    .getElementById("book")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Записаться на диагностику
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 min-h-[48px] border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => {
                  document
                    .getElementById("book")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Написать в WhatsApp
              </Button>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                Диагностика проходит онлайн в Microsoft Teams.
                Продолжительность: 20-30 минут. Запись по желанию.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Дополнительный блок с гарантией */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
            <Gift className="mr-2 h-4 w-4" />
            Никаких скрытых платежей • Честная оценка • Полезные советы
          </div>
        </div>
      </div>
    </section>
  );
}
