import { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
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
import { Checkbox } from "./ui/checkbox";
import { MessageCircle, Phone } from "lucide-react";

type Errors = Partial<
  Record<"name" | "contact" | "goal" | "comment" | "consent", string>
>;

const PHONE_RE =
  /^(?:(?:\+?\d{1,3})?[\s.-]?)?(?:\(?\d{3,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;
const TG_USER_RE = /^@?[a-zA-Z0-9_]{5,32}$/;
const TG_LINK_RE = /^https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}(\/\d+)?$/i;

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    goal: "",
    comment: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // hCaptcha
  const captchaRef = useRef<any>(null);
const sitekey = import.meta.env.VITE_HCAPTCHA_SITEKEY as string;
  const [pendingAction, setPendingAction] = useState<"whatsapp" | "telegram" | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Анти-спам: honeypot + минимальное время + локальный rate-limit
  const [website, setWebsite] = useState(""); // honeypot
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const goals = [
    "Начать с нуля",
    "Петь смелее/чище",
    "Подготовка к записи/концерту",
    "Расширить диапазон",
    "Научиться писать музыку",
    "Научиться писать тексты",
    "Другое",
  ];

  // ---- ВАЛИДАТОРЫ ----
  const validateName = (v: string) => {
    const trimmed = v.trim();
    if (!trimmed) return "Укажите имя";
    if (trimmed.length < 2) return "Имя слишком короткое";
    if (trimmed.length > 60) return "Имя слишком длинное";
    return "";
  };

  const validateContact = (v: string) => {
    const trimmed = v.trim();
    if (!trimmed) return "Укажите телефон или Telegram";
    const isPhone = PHONE_RE.test(trimmed.replace(/\s+/g, ""));
    const isTg =
      TG_LINK_RE.test(trimmed) ||
      TG_USER_RE.test(trimmed.startsWith("@") ? trimmed.slice(1) : trimmed);
    if (!isPhone && !isTg)
      return "Неверный контакт. Пример: +7 999 123-45-67 или @username";
    return "";
  };

  const validateGoal = (v: string) => (!v ? "Выберите цель" : "");
  const validateComment = (v: string) =>
    v.length > 400 ? "Слишком длинный комментарий (до 400 символов)" : "";
  const validateConsent = (v: boolean) =>
    v ? "" : "Нужно согласие на обработку данных";

  const setField =
    (key: keyof typeof formData) =>
    (value: string | boolean) => {
      setFormData((s) => ({ ...s, [key]: value }));
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

  const touchField = (field: keyof Errors) => {
    let msg = "";
    if (field === "name") msg = validateName(formData.name);
    if (field === "contact") msg = validateContact(formData.contact);
    if (field === "goal") msg = validateGoal(formData.goal);
    if (field === "comment") msg = validateComment(formData.comment);
    if (field === "consent") msg = validateConsent(formData.consent);
    setErrors((e) => ({ ...e, [field]: msg || undefined }));
  };

  // ---- ДЕЙСТВИЯ ----
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Здравствуйте! Хочу записаться на урок вокала.

Имя: ${formData.name || "[не указано]"}
Цель: ${formData.goal || "[не указана]"}
${formData.comment ? "Комментарий: " + formData.comment : ""}`
    );
    window.open(`https://wa.me/79277212376?text=${message}`, "_blank");
  };

  const openTelegram = () => {
    const message = encodeURIComponent(
      `Здравствуйте! Хочу записаться на урок вокала.

Имя: ${formData.name || "[не указано]"}
Цель: ${formData.goal || "[не указана]"}
${formData.comment ? "Комментарий: " + formData.comment : ""}`
    );
    window.open(`https://t.me/GardeRik?text=${message}`, "_blank");
  };

  const passAntiSpam = () => {
    if (website) return { ok: false, reason: "honeypot" };
    if (Date.now() - startedAtRef.current < 2000)
      return { ok: false, reason: "too_fast" };
    const key = "contactForm:lastSubmit";
    const last = Number(localStorage.getItem(key) || 0);
    if (Date.now() - last < 60_000)
      return { ok: false, reason: "rate_limited" };
    localStorage.setItem(key, String(Date.now()));
    return { ok: true as const };
  };

  const doAction = (action: "whatsapp" | "telegram") => {
    if (action === "whatsapp") openWhatsApp();
    else openTelegram();

    // Сброс токена после действия
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha?.();
    setPendingAction(null);
  };

  const handlePreSubmit = (action: "whatsapp" | "telegram") => {
    setIsSubmitting(true);
    try {
      if (!validateAll()) return;

      const anti = passAntiSpam();
      if (!anti.ok) {
        if (anti.reason === "too_fast") alert("Слишком быстро. Заполните форму честно 😊");
        if (anti.reason === "rate_limited") alert("Слишком часто. Попробуйте через минуту.");
        return;
      }

      // Запоминаем намерение и запускаем невидимую капчу
      setPendingAction(action);

      if (!sitekey) {
        // На случай, если забыли ключ — не ломаем UX
        console.warn("HCaptcha sitekey не задан. Пропускаем проверку.");
        doAction(action);
        return;
      }

      // Если есть свежий токен — действуем сразу; иначе просим hCaptcha
      if (captchaToken) {
        doAction(action);
      } else {
        captchaRef.current?.execute?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                {/* HONEYPOT (скрытое поле для ботов) */}
                <div className="hidden">
                  <label htmlFor="website">Ваш сайт</label>
                  <input
                    id="website"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setField("name")(e.target.value)}
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
                    <Label htmlFor="contact">Контакт</Label>
                    <Input
                      id="contact"
                      placeholder="Телефон или @telegram"
                      value={formData.contact}
                      onChange={(e) => setField("contact")(e.target.value)}
                      onBlur={() => touchField("contact")}
                      aria-invalid={!!errors.contact}
                      aria-describedby={
                        errors.contact ? "contact-error" : undefined
                      }
                    />
                    {errors.contact && (
                      <p id="contact-error" className="text-sm text-destructive">
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Цель</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) => {
                      setField("goal")(value);
                      setErrors((e) => ({ ...e, goal: undefined }));
                    }}
                    onOpenChange={(open) => {
                      if (!open) touchField("goal");
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.goal}>
                      <SelectValue placeholder="Выберите цель" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.map((goal) => (
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
                    value={formData.comment}
                    onChange={(e) => setField("comment")(e.target.value)}
                    onBlur={() => touchField("comment")}
                    rows={3}
                    aria-invalid={!!errors.comment}
                    aria-describedby={
                      errors.comment ? "comment-error" : undefined
                    }
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

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => {
                      setField("consent")(!!checked);
                      setErrors((e) => ({ ...e, consent: undefined }));
                    }}
                    onBlur={() => touchField("consent")}
                  />
                  <Label
                    htmlFor="consent"
                    className="text-sm leading-5 cursor-pointer"
                  >
                    Согласен(на) на обработку данных и условия переноса
                    (предупреждать за 24 ч)
                  </Label>
                </div>
                {errors.consent && (
                  <p className="text-sm text-destructive">{errors.consent}</p>
                )}

                {/* HCaptcha — невидимый виджет */}
                {sitekey && (
                  <HCaptcha
                    ref={captchaRef}
                    sitekey={sitekey}
                    size="invisible"
                    onVerify={(token: string /*, ekey: string*/) => {
                      setCaptchaToken(token);
                      if (pendingAction) doAction(pendingAction);
                    }}
                    onExpire={() => {
                      setCaptchaToken(null);
                    }}
                    onError={(err: unknown) => {
                      console.warn("HCaptcha error:", err);
                      alert("Проверка не прошла. Попробуйте ещё раз.");
                      setCaptchaToken(null);
                      captchaRef.current?.resetCaptcha?.();
                    }}
                  />
                )}

                <div className="grid grid-cols-1 gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => handlePreSubmit("whatsapp")}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Написать в WhatsApp
                  </Button>

                  <Button
                    type="button"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => handlePreSubmit("telegram")}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Написать в Telegram
                  </Button>
                </div>
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
