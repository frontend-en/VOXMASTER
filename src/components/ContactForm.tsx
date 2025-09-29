import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Checkbox } from "./ui/checkbox";
import { MessageCircle, Phone } from "lucide-react";
import { RequiredLabel } from "./ui/requiredLabel";

const CONTACT_GOALS = [
  "Начать с нуля",
  "Петь смелее/чище",
  "Подготовка к записи/концерту",
  "Расширить диапазон",
  "Научиться писать музыку",
  "Научиться писать тексты",
  "Другое",
] as const;

const PHONE_RE =
  /^(?:(?:\+?\d{1,3})?[\s.-]?)?(?:\(?\d{3,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;
const TG_USER_RE = /^@?[a-zA-Z0-9_]{5,32}$/;
const TG_LINK_RE = /^https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}(\/\d+)?$/i;

const MESSENGER_ENDPOINTS = {
  whatsapp: "https://wa.me/79277212376?text=",
  telegram: "https://t.me/GardeRik?text=",
} as const;

type MessengerChannel = keyof typeof MESSENGER_ENDPOINTS;

type ContactFormState = {
  name: string;
  contact: string;
  goal: string;
  comment: string;
  consent: boolean;
};

type ContactFormField = keyof ContactFormState;
type ContactFormErrors = Partial<Record<ContactFormField, string>>;

const INITIAL_FORM_STATE: ContactFormState = {
  name: "",
  contact: "",
  goal: "",
  comment: "",
  consent: false,
};

const CONTACT_FIELDS: ContactFormField[] = [
  "name",
  "contact",
  "goal",
  "comment",
  "consent",
];

const VALIDATORS: Record<
  ContactFormField,
  (value: ContactFormState[ContactFormField], state: ContactFormState) => string
> = {
  name: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Укажите имя";
    if (trimmed.length < 2) return "Имя слишком короткое";
    if (trimmed.length > 60) return "Имя слишком длинное";
    return "";
  },
  contact: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Укажите телефон или Telegram";
    const normalized = trimmed.replace(/\s+/g, "");
    const sanitized = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
    const isPhone = PHONE_RE.test(normalized);
    const isTelegram = TG_LINK_RE.test(trimmed) || TG_USER_RE.test(sanitized);
    if (!isPhone && !isTelegram) {
      return "Неверный контакт. Пример: +7 999 123-45-67 или @username";
    }
    return "";
  },
  goal: (value) => (value ? "" : "Выберите цель"),
  comment: (value) =>
    value.length > 400 ? "Слишком длинный комментарий (до 400 символов)" : "",
  consent: (value) =>
    value ? "" : "Нужно согласие на обработку данных",
};

function buildMessengerMessage(state: ContactFormState) {
  return encodeURIComponent(
    `Здравствуйте! Хочу записаться на урок вокала.\n\nИмя: ${
      state.name || "[не указано]"
    }\nТелефон: ${state.contact || "[не указано]"}\nЦель: ${
      state.goal || "[не указана]"
    }\n${state.comment ? "Комментарий: " + state.comment : ""}`
  );
}

function openMessenger(channel: MessengerChannel, message: string) {
  if (typeof window === "undefined") return;
  const base = MESSENGER_ENDPOINTS[channel];
  window.open(`${base}${message}`, "_blank", "noopener,noreferrer");
}

type AntiSpamResult =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "too_fast" | "rate_limited" };

function useContactForm() {
  const [state, setState] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [website, setWebsite] = useState("");
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const updateField = useCallback(<T extends ContactFormField>(
    field: T,
    value: ContactFormState[T]
  ) => {
    setState((prev) => {
      const next = { ...prev, [field]: value };
      setErrors((prevErrors) => {
        if (!prevErrors[field]) return prevErrors;
        const message = VALIDATORS[field](next[field], next);
        if (message) {
          if (prevErrors[field] === message) return prevErrors;
          return { ...prevErrors, [field]: message };
        }
        const { [field]: _ignored, ...rest } = prevErrors;
        return rest;
      });
      return next;
    });
  }, []);

  const touchField = useCallback((field: ContactFormField) => {
    setState((prev) => {
      setErrors((prevErrors) => {
        const message = VALIDATORS[field](prev[field], prev);
        if (message) {
          if (prevErrors[field] === message) return prevErrors;
          return { ...prevErrors, [field]: message };
        }
        if (!prevErrors[field]) return prevErrors;
        const { [field]: _ignored, ...rest } = prevErrors;
        return rest;
      });
      return prev;
    });
  }, []);

  const validateAll = useCallback(() => {
    const nextErrors: ContactFormErrors = {};
    CONTACT_FIELDS.forEach((field) => {
      const message = VALIDATORS[field](state[field], state);
      if (message) nextErrors[field] = message;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [state]);

  const passAntiSpam = useCallback((): AntiSpamResult => {
    if (website) return { ok: false, reason: "honeypot" };
    if (Date.now() - startedAtRef.current < 2000) {
      return { ok: false, reason: "too_fast" };
    }
    if (typeof window === "undefined") {
      return { ok: true };
    }
    const key = "contactForm:lastSubmit";
    const last = Number(window.localStorage.getItem(key) || 0);
    if (Date.now() - last < 60_000) {
      return { ok: false, reason: "rate_limited" };
    }
    window.localStorage.setItem(key, String(Date.now()));
    return { ok: true };
  }, [website]);

  const handleMessenger = useCallback(
    (channel: MessengerChannel) => {
      setIsSubmitting(true);
      try {
        if (!validateAll()) return;
        const anti = passAntiSpam();
        if (!anti.ok) {
          if (anti.reason === "too_fast") {
            alert("Слишком быстро. Заполните форму честно 😊");
          }
          if (anti.reason === "rate_limited") {
            alert("Слишком часто. Попробуйте через минуту.");
          }
          return;
        }
        const message = buildMessengerMessage(state);
        openMessenger(channel, message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [passAntiSpam, state, validateAll]
  );

  const isFormValid = useMemo(
    () =>
      CONTACT_FIELDS.every(
        (field) => !VALIDATORS[field](state[field], state)
      ),
    [state]
  );

  return {
    state,
    errors,
    isSubmitting,
    isFormValid,
    updateField,
    touchField,
    handleMessenger,
    website,
    setWebsite,
  };
}

export function ContactForm() {
  const {
    state,
    errors,
    isSubmitting,
    isFormValid,
    updateField,
    touchField,
    handleMessenger,
    website,
    setWebsite,
  } = useContactForm();

  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4 mx-auto">Запись на урок</h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border border-border/60">
            <CardContent className="p-6 md:p-8">
              <form className="space-y-6" noValidate>
                {/* honeypot */}
                <div className="hidden">
                  <label htmlFor="website">Ваш сайт</label>
                  <input
                    id="website"
                    name="website"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="name">Имя</RequiredLabel>
                  <Input
                    id="name"
                    placeholder="Как можно к вам обращаться?"
                    value={state.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    onBlur={() => touchField("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="contact">
                    Телефон или Telegram
                  </RequiredLabel>
                  <Input
                    id="contact"
                    placeholder="+7 900 123-45-67 или @username"
                    value={state.contact}
                    onChange={(event) =>
                      updateField("contact", event.target.value)
                    }
                    onBlur={() => touchField("contact")}
                    aria-invalid={!!errors.contact}
                    aria-describedby={
                      errors.contact ? "contact-error" : undefined
                    }
                    autoComplete="tel"
                  />
                  {errors.contact && (
                    <p id="contact-error" className="text-sm text-destructive">
                      {errors.contact}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <RequiredLabel htmlFor="goal">Цель</RequiredLabel>
                  <Select
                    value={state.goal}
                    onValueChange={(value) => updateField("goal", value)}
                    onOpenChange={(open) => {
                      if (!open) touchField("goal");
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.goal}>
                      <SelectValue placeholder="Выберите цель" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_GOALS.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.goal && (
                    <p className="text-sm text-destructive">{errors.goal}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea
                    id="comment"
                    placeholder="Коротко о вашем опыте и любимых песнях"
                    value={state.comment}
                    onChange={(event) =>
                      updateField("comment", event.target.value)
                    }
                    onBlur={() => touchField("comment")}
                    rows={3}
                    aria-invalid={!!errors.comment}
                    aria-describedby={
                      errors.comment ? "comment-error" : undefined
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span id="comment-hint">Необязательно</span>
                    <span>{state.comment.length}/400</span>
                  </div>
                  {errors.comment && (
                    <p id="comment-error" className="text-sm text-destructive">
                      {errors.comment}
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="consent"
                    checked={state.consent}
                    onCheckedChange={(checked) =>
                      updateField("consent", Boolean(checked))
                    }
                    onBlur={() => touchField("consent")}
                  />
                  <RequiredLabel htmlFor="consent">
                    Согласен(на) на обработку данных и условия переноса занятия
                    (предупреждать за 24 ч)
                  </RequiredLabel>
                </div>
                {errors.consent && (
                  <p className="text-sm text-destructive">{errors.consent}</p>
                )}

                <TooltipProvider delayDuration={200}>
                  <div className="grid grid-cols-1 gap-3 pt-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="w-full">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={!isFormValid || isSubmitting}
                            onClick={() => handleMessenger("whatsapp")}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Написать в WhatsApp
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!isFormValid && (
                        <TooltipContent className="max-w-xs text-sm leading-relaxed">
                          Пожалуйста, заполните все обязательные поля и
                          подтвердите согласие — тогда кнопка станет доступна.
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="w-full">
                          <Button
                            type="button"
                            className="w-full"
                            disabled={!isFormValid || isSubmitting}
                            onClick={() => handleMessenger("telegram")}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Написать в Telegram
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!isFormValid && (
                        <TooltipContent className="max-w-xs text-sm leading-relaxed">
                          Заполните имя, контакт, цель и согласие, чтобы
                          продолжить в Telegram.
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Кнопки мессенджеров откроют чат с предзаполненным сообщением.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
