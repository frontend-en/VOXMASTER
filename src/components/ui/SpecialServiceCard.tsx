import { SPECIAL_SERVICES_COPY } from "../../lib/consts";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Check,
  Clock,
  CreditCard,
  HelpCircle,

} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SpecialServiceContent = typeof SPECIAL_SERVICES_COPY.supervision;

type SpecialServiceAccent = {
  cardClass: string;
  iconClass: string;
  checkClass: string;
  resultContainerClass: string;
  ctaButtonClass?: string;
};

type SpecialServiceCardProps = {
  copy: SpecialServiceContent;
  icon: LucideIcon;
  accent: SpecialServiceAccent;
  questionCta: string;
  isPaying: boolean;
  onPayment: (title: string, price: string) => void;
  onQuestionClick: () => void;
};



export function SpecialServiceCard({
  copy,
  icon: Icon,
  accent,
  questionCta,
  isPaying,
  onPayment,
  onQuestionClick,
}: SpecialServiceCardProps) {
  return (
    <Card
      className={`relative h-full rounded-[18px] shadow-lg ${accent.cardClass}`}
    >
      <CardHeader className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-5 w-5 ${accent.iconClass}`} />
          <CardTitle>{copy.title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{copy.tagline}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{copy.price}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{copy.durationHint}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-around">
        <div className="mb-5">
          <p className="text-sm text-muted-foreground mb-4">
            {copy.description}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-3 text-foreground">
            {copy.highlightsTitle}
          </h4>
          <ul className="space-y-2.5">
            {copy.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <Check
                  className={`h-4 w-4 mt-0.5 flex-shrink-0 ${accent.checkClass}`}
                />
                <span className="text-sm text-muted-foreground">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`rounded-lg p-4 mt-auto ${accent.resultContainerClass}`}
        >
          <h5 className="text-sm font-medium mb-2 text-foreground">
            {copy.resultTitle}
          </h5>
          <ul className="space-y-1.5">
            {copy.results.map((result) => (
              <li key={result} className="text-sm text-muted-foreground">
                {result}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 w-full">
          <Button
            className={`w-full min-h-[44px] ${accent.ctaButtonClass ?? ""}`}
            onClick={() => onPayment(copy.planTitle, copy.planPrice)}
            disabled={isPaying}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {copy.ctaLabel}
          </Button>
          <Button
            variant="outline"
            className="w-full min-h-[44px]"
            onClick={onQuestionClick}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            {questionCta}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}