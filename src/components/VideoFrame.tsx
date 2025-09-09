import { useState } from "react";
import Play from "lucide-react/dist/esm/icons/play";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { videoposter } from "../assets";

/**
 * RUTUBE EMBED
 * Пример из задания:
 * https://rutube.ru/play/embed/670a0a324732fb991b08962272fade61/?p=null
 */
const RUTUBE_EMBED_URL =
  "https://rutube.ru/play/embed/670a0a324732fb991b08962272fade61/?p=null";

export function VideoFrame() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // когда true — монтируем iframe
  const [err, setErr] = useState<string | null>(null);

  const start = () => {
    setErr(null);
    setLoading(true);
    // монтируем плеер; autoplay сработает как жест пользователя
    setMounted(true);
  };

  return (
    <div className="relative w-full aspect-video bg-card border border-border/20 rounded-[18px] overflow-hidden">
      {/* iframe Rutube (монтируем после клика) */}
      {mounted && (
        <iframe
          className="absolute inset-0 w-full h-full"
          title="Видео: как проходят уроки"
          src={
            RUTUBE_EMBED_URL +
            (RUTUBE_EMBED_URL.includes("?") ? "&" : "?") +
            "autoplay=1"
          }
          frameBorder={0}
          allow="clipboard-write; autoplay"
          allowFullScreen
          // Safari/macOS-friendly: без transform/opacity-хаков, монтируем по клику
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setErr("Не удалось загрузить плеер Rutube.");
          }}
        />
      )}

      {/* Постер и кнопка Play — пока iframe не смонтирован */}
      {!mounted && (
        <>
          <ImageWithFallback
            loading="lazy"
            src={videoposter}
            alt="Видео: как проходит урок"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
            <button
              type="button"
              aria-label="Воспроизвести видео"
              className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-primary/30 min-h-[44px] min-w-[44px]"
              onClick={start}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-7 h-7 animate-spin text-primary-foreground" />
              ) : (
                <Play
                  className="w-7 h-7 text-primary-foreground ml-1"
                  fill="currentColor"
                />
              )}
            </button>
          </div>
        </>
      )}

      {/* Ошибка + быстрый фолбэк */}
      {err && (
        <div className="absolute bottom-2 left-2 right-2 text-[13px] text-red-200 bg-black/55 rounded-md px-2 py-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="flex-1">{err}</span>
          <a
            className="underline"
            href={RUTUBE_EMBED_URL}
            target="_blank"
            rel="noopener"
          >
            Открыть на Rutube
          </a>
        </div>
      )}
    </div>
  );
}
