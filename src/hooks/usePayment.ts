import { useCallback, useState } from "react";
import axios from "axios";
import { normalizeAmount } from "../lib/utils";

const PAYMENT_API_BASE =
// @ts-ignore
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PAYMENT_API) ||
  "https://nextjs-boilerplate-liard-omega-74.vercel.app";

const PAYMENT_ALERTS = {
  missingConfirmation: "Не удалось получить ссылку на оплату",
  error: "Ошибка при создании платежа",
} as const;

const DEFAULT_THANK_YOU_PATH = "/thank-you.html";
const DEFAULT_SOURCE = "voxcraft.studio";

type CreatePaymentArgs = {
  title: string;
  price: string;
  metadata?: Record<string, unknown>;
};

type UsePaymentOptions = {
  paymentApiBase?: string;
  thankYouPath?: string;
  source?: string;
  onError?: (error: unknown) => void;
  onMissingConfirmation?: () => void;
};

export function usePayment({
  paymentApiBase = PAYMENT_API_BASE,
  thankYouPath = DEFAULT_THANK_YOU_PATH,
  source = DEFAULT_SOURCE,
  onError,
  onMissingConfirmation,
}: UsePaymentOptions = {}) {
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = useCallback(
    async ({ title, price, metadata }: CreatePaymentArgs) => {
      if (isPaying) return;
      setIsPaying(true);

      try {
        const amount = normalizeAmount(price);
        const returnUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}${thankYouPath}`
            : undefined;

        const { data } = await axios.post(
          `${paymentApiBase}/api/create-payment`,
          {
            amount,
            description: title,
            returnUrl,
            metadata: {
              planTitle: title,
              source,
              ...metadata,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const url = data?.confirmation?.confirmation_url;
        if (url && typeof window !== "undefined") {
          window.location.assign(url);
        } else if (onMissingConfirmation) {
          onMissingConfirmation();
        } else {
          window.alert?.(PAYMENT_ALERTS.missingConfirmation);
        }
      } catch (error) {
        console.error(error);
        if (onError) {
          onError(error);
        } else {
          window.alert?.(PAYMENT_ALERTS.error);
        }
      } finally {
        setIsPaying(false);
      }
    },
    [isPaying, paymentApiBase, thankYouPath, source, onError, onMissingConfirmation]
  );

  return {
    isPaying,
    handlePayment,
  };
}
