import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import Menu from "lucide-react/dist/esm/icons/menu";
import Music from "lucide-react/dist/esm/icons/music";

type NavItem = { id: string; label: string };
const NAV: NavItem[] = [
  { id: "about", label: "Почему я" },
  // { id: "price", label: "Стоимость" },
  { id: "testimonials", label: "Отзывы" },
  { id: "faq", label: "FAQ" },
  { id: "book", label: "Запись" },
];

// Блокировка прокрутки при открытом мобильном меню
function useLockBody(lock: boolean) {
  useEffect(() => {
    const original = document.body.style.overflow;
    const pr = document.body.style.paddingRight;
    const sw = window.innerWidth - document.documentElement.clientWidth;
    if (lock) {
      document.body.style.overflow = "hidden";
      if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    }
    return () => {
      document.body.style.overflow = original || "";
      document.body.style.paddingRight = pr || "";
    };
  }, [lock]);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useLockBody(open);
  const firstLinkRef = useRef<HTMLButtonElement | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (open && firstLinkRef.current) {
      const id = setTimeout(() => firstLinkRef.current?.focus(), 10);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Тень и фон после скролла
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <header
        className={[
          // Базовый фон
          "border-b transition-[box-shadow,background-color,backdrop-filter] duration-300",
          // Фоллбек: если нет backdrop-filter — полупрозрачный фон
          "bg-background/90",
          // Если браузер поддерживает backdrop-filter — используем блюр и чуть меньше непрозрачность
          "supports-[backdrop-filter]:bg-background/70 supports-[backdrop-filter]:backdrop-blur-md",
          scrolled ? "shadow-sm" : "shadow-none",
        ].join(" ")}
      >
        {/* Skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-1 focus:rounded-md"
        >
          Перейти к контенту
        </a>

        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Branding */}
            <div className="flex items-center gap-2 min-w-0">
              <span aria-hidden className="text-2xl leading-none">🎤</span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                <span className="font-bold text-lg truncate">voxcraft.studio</span>
                <span className="text-sm text-muted-foreground hidden lg:block">
                  —
                </span>
                <span className="text-sm hidden lg:block">
                  уроки вокала, сонграйтинг, сольфеджио{" "}
                  <span className="text-primary">онлайн</span>
                </span>
              </div>
            </div>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Основная навигация"
            >
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="whitespace-nowrap text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right controls + Mobile burger */}
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <Button
                size="sm"
                onClick={() => scrollToSection("book")}
                className="hidden sm:inline-flex"
              >
                Запись
              </Button>

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="md:hidden"
                    aria-label="Открыть меню"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  id="mobile-menu"
                  side="right"
                  className="p-0 flex flex-col"
                  aria-label="Мобильная навигация"
                >
                  <SheetHeader className="border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Music className="h-5 w-5" />
                      <SheetTitle className="font-semibold">Навигация</SheetTitle>
                    </div>
                  </SheetHeader>

                  <nav
                    className="flex-1 overflow-y-auto py-2"
                    aria-label="Секции сайта"
                  >
                    <ul className="flex flex-col">
                      {NAV.map((item, i) => (
                        <li key={item.id}>
                          <SheetClose asChild>
                            <button
                              ref={i === 0 ? firstLinkRef : undefined}
                              onClick={() => scrollToSection(item.id)}
                              className="w-full text-left px-6 py-3 text-base hover:bg-muted focus:bg-muted transition-colors focus:outline-none whitespace-nowrap"
                            >
                              {item.label}
                            </button>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <SheetFooter className="border-t px-6 pb-6 pt-4">
                    <SheetClose asChild>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => scrollToSection("book")}
                      >
                        Записаться на урок
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
