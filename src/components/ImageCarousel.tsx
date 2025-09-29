import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

export type Slide = { src: string; alt?: string; className?: string };

export function ImageCarousel({
  images,
  autoPlayMs = 4000,
  rounded = "rounded-lg",
}: {
  images: Slide[];
  autoPlayMs?: number;
  rounded?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Контейнер, куда ставим высоту
  const containerRef = useRef<HTMLDivElement>(null);

  // Ссылки именно на IMG
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const setImgRef = (el: HTMLImageElement | null, i: number) => {
    imgRefs.current[i] = el;
  };

  // Авто-высота
  const [autoH, setAutoH] = useState<number>(0);

  // Наблюдаем за активным IMG
  useEffect(() => {
    const img = imgRefs.current[active];
    if (!img) return;

    const apply = () => {
      const h = img.clientHeight;
      if (h && h !== autoH) setAutoH(h);
    };

    // первичная попытка (если уже загружено)
    apply();

    // на загрузку
    if (!img.complete) {
      img.addEventListener("load", apply, { once: true });
    }

    // ResizeObserver — меняется ширина/шрифты/контейнер
    const ro = new ResizeObserver(apply);
    ro.observe(img);

    return () => ro.disconnect();
  }, [active, images.length]); // autoH не включаем, чтобы не зациклить

  // Автоплей
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), autoPlayMs);
    return () => clearInterval(id);
  }, [paused, images.length, autoPlayMs]);

  const go = (i: number) => setActive((i + images.length) % images.length);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: autoH || undefined, transition: "height 300ms ease" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div
        className="flex w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full shrink-0">
            {/* ВАЖНО: высоту задаёт картинка — без object-cover */}
            <img
              loading="lazy"
              ref={(el) => setImgRef(el, idx)}
              src={img.src}
              alt={img.alt ?? ""}
              className={cn("block w-full h-[400px] object-cover", rounded, img.className)}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущий"
            onClick={() => go(active - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-background/70 hover:bg-background/90 shadow p-2"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Следующий"
            onClick={() => go(active + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-background/70 hover:bg-background/90 shadow p-2"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
