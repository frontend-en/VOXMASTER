import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Phone from "lucide-react/dist/esm/icons/phone";
import UserRound from "lucide-react/dist/esm/icons/user-round";
import CreditCard from "lucide-react/dist/esm/icons/credit-card";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTitle?: string;
  planPrice?: string;
}

type Errors = Partial<Record<"name" | "contact", string>>;

export function PaymentModal({
  isOpen,
  onClose,
  planTitle,
  planPrice,
}: PaymentModalProps) {
  const [formData, setFormData] = useState({ name: "", contact: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // антиспам
  const [website, setWebsite] = useState("");
  const startedAtRef = useRef<number>(Date.now());
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const PHONE_RE =
    /^(?:(?:\+?\d{1,3})?[\s.-]?)?(?:\(?\d{3,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;
  const TG_RE = /^@?[a-zA-Z0-9_]{5,32}$/;

  const validateName = (v: string) => {
    if (!v.trim()) return "Укажите имя";
    if (v.trim().length < 2) return "Слишком короткое имя";
    if (v.trim().length > 60) return "Слишком длинное имя";
    return "";
  };

  const validateContact = (v: string) => {
    if (!v.trim()) return "Укажите телефон или Telegram";
    const clean = v.trim();
    if (!PHONE_RE.test(clean) && !TG_RE.test(clean.replace(/^@/, ""))) {
      return "Неверный формат (пример: +7 999 123-45-67 или @username)";
    }
    return "";
  };

  const validateAll = (): boolean => {
    const nextErrors: Errors = {
      name: validateName(formData.name),
      contact: validateContact(formData.contact),
    };
    Object.keys(nextErrors).forEach((k) => {
      if (!(nextErrors as any)[k]) delete (nextErrors as any)[k];
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const passAntiSpam = () => {
    if (website) return { ok: false, reason: "honeypot" };
    if (Date.now() - startedAtRef.current < 2000)
      return { ok: false, reason: "too_fast" };
    const key = "paymentForm:lastSubmit";
    const last = Number(localStorage.getItem(key) || 0);
    if (Date.now() - last < 60_000)
      return { ok: false, reason: "rate_limited" };
    localStorage.setItem(key, String(Date.now()));
    return { ok: true as const };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    const anti = passAntiSpam();
    if (!anti.ok) {
      if (anti.reason === "too_fast")
        alert("Слишком быстро. Заполните форму честно 😊");
      if (anti.reason === "rate_limited")
        alert("Слишком часто. Попробуйте позже.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Payment form data:", { ...formData, planTitle, planPrice });
      alert(`Переход к оплате для ${planTitle || "выбранного тарифа"}`);
    } finally {
      setIsSubmitting(false);
      handleClose(); // 👈 одного вызова достаточно
    }
  };

  const handleClose = () => {
    // если идёт сабмит — не закрываем
    if (isSubmitting) return;
    setFormData({ name: "", contact: "" });
    setErrors({});
    onClose();
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.contact.trim().length > 0 &&
    !errors.name &&
    !errors.contact;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-md w-full mx-4 sm:mx-auto bg-card backdrop-blur-md border border-border/50 shadow-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Введите данные для оплаты</DialogTitle>
              <DialogDescription className="mt-1">
                Чтобы идентифицировать вас перед платежом
              </DialogDescription>
            </div>
          </div>

          {planTitle && (
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50 mt-3">
              <div className="text-sm font-medium text-foreground">
                {planTitle}
              </div>
              {planPrice && (
                <div className="text-lg font-semibold text-primary mt-1">
                  {planPrice}
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
          autoComplete="off"
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

          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <UserRound className="w-4 h-4 text-muted-foreground" />
              Имя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ваше имя"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              onBlur={() =>
                setErrors((e) => ({
                  ...e,
                  name: validateName(formData.name),
                }))
              }
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label
              htmlFor="contact"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Phone className="w-4 h-4 text-muted-foreground" />
              Телефон или Telegram <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact"
              type="text"
              placeholder="+7 (999) 123-45-67 или @username"
              value={formData.contact}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, contact: e.target.value }))
              }
              onBlur={() =>
                setErrors((e) => ({
                  ...e,
                  contact: validateContact(formData.contact),
                }))
              }
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? "contact-error" : undefined}
              required
              disabled={isSubmitting}
            />
            {errors.contact && (
              <p id="contact-error" className="text-sm text-destructive">
                {errors.contact}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full sm:flex-1">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      disabled={isSubmitting || !isFormValid}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Обработка...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Продолжить к оплате
                        </>
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isFormValid && (
                  <TooltipContent>
                    Заполните все обязательные поля, чтобы продолжить
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto h-12 px-6 hover:bg-muted"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Отмена
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
