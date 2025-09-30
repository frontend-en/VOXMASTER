import { Calendar, Check, Gift, MessageCircle } from "lucide-react";
import { scrollToElementById } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const FREE_DIAGNOSTIC_COPY = {
  badge: "Бесплатно",
  title: "Бесплатная диагностика вокальных данных",
  lead:
    "Узнайте свои сильные стороны и зоны роста за 20-30 минут. Никаких обязательств — просто честная оценка ваших возможностей.",
  benefitsTitle: "Что вы получите:",
  benefits: [
    "Анализ текущего уровня техники дыхания",
    "Оценка диапазона и тембральных особенностей",
    "Выявление индивидуальных зажимов и блоков",
    "Рекомендации по развитию голоса",
    "Персональный план развития на 3-6 месяцев",
  ],
  ctas: {
    primary: "Записаться на диагностику",
    secondary: "Написать в WhatsApp",
  },
  infoNote:
    "Диагностика проходит онлайн в Microsoft Teams. Продолжительность: 20-30 минут. Запись по желанию.",
  guarantee: "Никаких скрытых платежей • Честная оценка • Полезные советы",
} as const;

export function FreeDiagnostic() {
  const scrollToBooking = () => scrollToElementById("book");

  return (
    <section className="py-8 px-4 md:py-8 lg:py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="relative border-2 border-secondary rounded-[18px] bg-secondary/5 shadow-lg ios-fix-text">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-secondary text-secondary-foreground px-4 py-1 ios-fix-text">
              <Gift className="mr-1.5 h-3.5 w-3.5" />
              {FREE_DIAGNOSTIC_COPY.badge}
            </Badge>
          </div>

          <CardHeader className="text-center pt-8 pb-6">
            <CardTitle className="text-2xl md:text-3xl mb-3 ios-fix-text">
              {FREE_DIAGNOSTIC_COPY.title}
            </CardTitle>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto ios-fix-text">
              {FREE_DIAGNOSTIC_COPY.lead}
            </p>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="mb-8">
              <h4 className="text-center mb-6 font-medium text-foreground ios-fix-text">
                {FREE_DIAGNOSTIC_COPY.benefitsTitle}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {FREE_DIAGNOSTIC_COPY.benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className={`flex items-start gap-3${index === FREE_DIAGNOSTIC_COPY.benefits.length - 1 ? " md:col-span-2" : ""}`}
                  >
                    <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground ios-fix-muted">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Button
                size="lg"
                className="flex-1 min-h-[48px] bg-secondary hover:bg-secondary/90 text-secondary-foreground ios-fix-text"
                onClick={scrollToBooking}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {FREE_DIAGNOSTIC_COPY.ctas.primary}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 min-h-[48px] border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground ios-fix-text"
                onClick={scrollToBooking}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {FREE_DIAGNOSTIC_COPY.ctas.secondary}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto ios-fix-muted">
                {FREE_DIAGNOSTIC_COPY.infoNote}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm ios-fix-bg ios-fix-muted">
            <Gift className="mr-2 h-4 w-4" />
            {FREE_DIAGNOSTIC_COPY.guarantee}
          </div>
        </div>
      </div>
    </section>
  );
}
