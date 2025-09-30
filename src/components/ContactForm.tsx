import { useEffect, useRef, useState } from "react";
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

// ---- Типы ----
interface ContactFormState {
  name: string;
  contact: string;
  goal: string;
  comment: string;
  consent: boolean;
}
type ContactFormField = keyof ContactFormState;
type Errors = Partial<Record<ContactFormField, string>>;

// ---- Валидация ----
const PHONE_RE =
  /^(?:(?:\+?\d{1,3})?[\s.-]?)?(?:\(?\d{3,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;
const TG_USER_RE = /^@?[a-zA-Z0-9_]{5,32}$/;
const TG_LINK_RE = /^https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}(\/\d+)?$/i;

const goals = [
  "Начать с нуля",
  "Петь смелее/чище",
  "Подготовка к записи/концерту",
  "Расширить диапазон",
  "Научиться писать музыку",
  "Научиться писать тексты",
  "Другое",
];

function validateName(v: string) {
  const t = v.trim();
  if (!t) return "Укажите имя";
  if (t.length < 2) return "Имя слишком короткое";
  if (t.length > 60) return "Имя слишком длинное";
  return "";
}
function validateContact(v: string) {
  const t = v.trim();
  if (!t) return "Укажите телефон или Telegram";
  const isPhone = PHONE_RE.test(t.replace(/\s+/g, ""));
  const isTg =
    TG_LINK_RE.test(t) || TG_USER_RE.test(t.startsWith("@") ? t.slice(1) : t);
  if (!isPhone && !isTg)
    return "Неверный контакт. Пример: +7 999 123-45-67 или @username";
  return "";
}
function validateGoal(v: string) {
  return v ? "" : "Выберите цель";
}
function validateComment(v: string) {
  return v.length > 400
    ? "Слишком длинный комментарий (до 400 символов)"
    : "";
}
function validateConsent(v: boolean) {
  return v ? "" : "Нужно согласие на обработку данных";
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    contact: "",
    goal: "",
    comment: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  // --- Хелперы ---
  const setField = <K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K]
  ) => {
    setFormData((s) => ({ ...s, [key]: value }));
  };

  const touchField = (field: ContactFormField) => {
    let msg = "";
    if (field === "name") msg = validateName(formData.name);
    if (field === "contact") msg = validateContact(formData.contact);
    if (field === "goal") msg = validateGoal(formData.goal);
    if (field === "comment") msg = validateComment(formData.comment);
    if (field === "consent") msg = validateConsent(formData.consent);
    setErrors((e) => ({ ...e, [field]: msg || undefined }));
  };

  const validateAll = (): boolean => {
    const nextErrors: Errors = {
      name: validateName(formData.name),
      contact: validateContact(formData.contact),
      goal: validateGoal(formData.goal),
      comment: validateComment(formData.comment),
      consent: validateConsent(formData.consent),
    };
    Object.keys(nextErrors).forEach((k) => {
      if (!(nextErrors as any)[k]) delete (nextErrors as any)[k];
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // --- Антиспам ---
  const passAntiSpam = () => {
    if (website) return { ok: false, reason: "honeypot" } as const;
    if (Date.now() - startedAtRef.current < 2000)
      return { ok: false, reason: "too_fast" } as const;
    const key = "contactForm:lastSubmit";
    const last = Number(localStorage.getItem(key) || 0);
    if (Date.now() - last < 60_000)
      return { ok: false, reason: "rate_limited" } as const;
    localStorage.setItem(key, String(Date.now()));
    return { ok: true } as const;
  };

  // --- Действия ---
  const openMessenger = (channel: "whatsapp" | "telegram") => {
    const message = encodeURIComponent(
      `Здравствуйте! Хочу записаться на урок вокала.\n\nИмя: ${
        formData.name || "[не указано]"
      }\nЦель: ${formData.goal || "[не указана]"}\n${
        formData.comment ? "Комментарий: " + formData.comment : ""
      }`
    );
    if (channel === "whatsapp") {
      window.open(`https://wa.me/79277212376?text=${message}`, "_blank");
    } else {
      window.open(`https://t.me/GardeRik?text=${message}`, "_blank");
    }
  };

  const handlePreSubmit = (action: "whatsapp" | "telegram") => {
    setIsSubmitting(true);
    try {
      if (!validateAll()) return;
      const anti = passAntiSpam();
      if (!anti.ok) {
        if (anti.reason === "too_fast")
          alert("Слишком быстро. Заполните форму честно 😊");
        if (anti.reason === "rate_limited")
          alert("Слишком часто. Попробуйте через минуту.");
        return;
      }
      openMessenger(action);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    !validateName(formData.name) &&
    !validateContact(formData.contact) &&
    !validateGoal(formData.goal) &&
    !validateComment(formData.comment) &&
    !validateConsent(formData.consent);

  // --- JSX ---
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4 mx-auto">Запись на урок</h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-6"
                noValidate
              >
                {/* honeypot */}
                <div className="hidden">
                  <label htmlFor="website">Ваш сайт</label>
                  <input
                    id="website"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {/* Имя + Контакт */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="name">Имя</RequiredLabel>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setField("name", e.target.value)}
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
                    <RequiredLabel htmlFor="contact">Контакт</RequiredLabel>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setField("contact", e.target.value)}
                      onBlur={() => touchField("contact")}
                      aria-invalid={!!errors.contact}
                      aria-describedby={
                        errors.contact ? "contact-error" : undefined
                      }
                    />
                    {errors.contact && (
                      <p
                        id="contact-error"
                        className="text-sm text-destructive"
                      >
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>

                {/* Цель */}
                <div className="space-y-2">
                  <RequiredLabel htmlFor="goal">Цель</RequiredLabel>
                  <Select
                    value={formData.goal}
                    onValueChange={(v) => setField("goal", v)}
                    onOpenChange={(open) => {
                      if (!open) touchField("goal");
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.goal}>
                      <SelectValue placeholder="Выберите цель" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.goal && (
                    <p className="text-sm text-destructive">{errors.goal}</p>
                  )}
                </div>

                {/* Комментарий */}
                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-lg font-light">Комментарий</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setField("comment", e.target.value)}
                    onBlur={() => touchField("comment")}
                    rows={3}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span id="comment-hint">Необязательно</span>
                    <span>{formData.comment.length}/400</span>
                  </div>
                  {errors.comment && (
                    <p id="comment-error" className="text-sm text-destructive">
                      {errors.comment}
                    </p>
                  )}
                </div>

                {/* Согласие */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) =>
                      setField("consent", Boolean(checked))
                    }
                    onBlur={() => touchField("consent")}
                  />
                  <RequiredLabel htmlFor="consent" style={{ flexDirection: "row-reverse", fontSize: "0.8rem" }} >
                    Согласен(на) на обработку данных и условия переноса
                    занятия (предупреждать за 24 ч)
                  </RequiredLabel>
                </div>
                {errors.consent && (
                  <p className="text-sm text-destructive">{errors.consent}</p>
                )}

                {/* Кнопки */}
                <TooltipProvider delayDuration={200}>
                  <div className="grid gap-3 pt-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="w-full">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={!isFormValid || isSubmitting}
                            onClick={() => handlePreSubmit("whatsapp")}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Написать в WhatsApp
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!isFormValid && (
                        <TooltipContent>
                          Заполните все обязательные поля
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
                            onClick={() => handlePreSubmit("telegram")}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Написать в Telegram
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!isFormValid && (
                        <TooltipContent>
                          Заполните все обязательные поля
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
