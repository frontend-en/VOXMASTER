import { useCallback } from "react";
import { SPECIAL_SERVICES_COPY } from "../lib/consts";
import { usePayment } from "../hooks/usePayment";
import {
  Users,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SpecialServiceCard } from "./ui/SpecialServiceCard";

type SpecialServiceContent = typeof SPECIAL_SERVICES_COPY.supervision;

type SpecialServiceAccent = {
  cardClass: string;
  iconClass: string;
  checkClass: string;
  resultContainerClass: string;
  ctaButtonClass?: string;
};

export function SpecialServices() {
  const {
    kicker,
    heading,
    lead,
    questionCta,
    supervision,
    intensive,
  } = SPECIAL_SERVICES_COPY;
  const { isPaying, handlePayment } = usePayment();

  const handlePaymentClick = useCallback(
    (planTitle: string, planPrice: string) =>
      handlePayment({
        title: planTitle,
        price: planPrice,
        metadata: { category: "special-services" },
      }),
    [handlePayment],
  );

  const handleQuestionClick = useCallback(() => {
    document
      .getElementById("book")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const supervisionAccent: SpecialServiceAccent = {
    cardClass: "border-2 border-secondary",
    iconClass: "text-secondary",
    checkClass: "text-secondary",
    resultContainerClass: "bg-secondary/10 border border-secondary/20",
    ctaButtonClass: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
  };

  const intensiveAccent: SpecialServiceAccent = {
    cardClass: "border-2 border-primary",
    iconClass: "text-primary",
    checkClass: "text-primary",
    resultContainerClass: "bg-primary/10 border border-primary/20",
  };

  return (
    <section className="py-8 px-4 md:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Кикер и заголовок */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
            {kicker}
          </div>
          <h2 className="mb-4">{heading}</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto рш">
            {lead}
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          <SpecialServiceCard
            copy={supervision}
            icon={Users}
            accent={supervisionAccent}
            questionCta={questionCta}
            isPaying={isPaying}
            onPayment={handlePaymentClick}
            onQuestionClick={handleQuestionClick}
          />

          <SpecialServiceCard
            copy={intensive}
            icon={Sparkles}
            accent={intensiveAccent}
            questionCta={questionCta}
            isPaying={isPaying}
            onPayment={handlePaymentClick}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </section>
  );
}
