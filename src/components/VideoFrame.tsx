import { useRef, useState, useCallback } from "react";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import Play from "lucide-react/dist/esm/icons/play";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { videoposter } from "../assets";

/** Публичная страница Яндекс.Диска с видео */
const YANDEX_PUBLIC_LINK = "https://disk.yandex.ru/i/502IKE7FV5nqCw";

/** Получаем прямой URL к файлу по публичной ссылке */
async function getYandexDirectUrl(publicLink: string, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const api =
      "https://cloud-api.yandex.net/v1/disk/public/resources/download";
    const url = `${api}?public_key=${encodeURIComponent(publicLink)}`;
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { href?: string };
    return data?.href ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export function VideoFrame() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handlePlay = useCallback(async () => {
    setErr(null);
    setBusy(true);
    try {
      let direct = src;
      if (!direct) {
        direct = await getYandexDirectUrl(YANDEX_PUBLIC_LINK);
        if (!direct) {
          setErr("Не удалось получить прямую ссылку с Яндекс.Диска.");
          return;
        }
        setSrc(direct);
      }

      setPlaying(true);
      // Даем браузеру смонтировать <video> со src и запустить воспроизведение
      requestAnimationFrame(() => {
        videoRef.current?.play().catch(() => {
          /* пользователь нажмёт play вручную */
        });
      });
    } finally {
      setBusy(false);
    }
  }, [src]);

  return (
    <div className="relative w-full aspect-video bg-card border border-border/20 rounded-[18px] overflow-hidden group">
      {/* Видео появляется, когда есть src */}
      {src && (
        <video
          ref={videoRef}
          src={src}
          poster={videoposter}
          preload="metadata"
          playsInline
          controls
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          onPlaying={() => setBusy(false)}
          onWaiting={() => setBusy(true)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            setErr("Видео не смогло воспроизвестись в этом браузере.");
            setPlaying(false);
          }}
        >
          Ваш браузер не поддерживает видео.
        </video>
      )}

      {/* Постер и кнопка Play поверх, пока не идёт воспроизведение */}
      {!playing && (
        <>
          <ImageWithFallback
            loading="lazy"
            src={videoposter}
            alt="Видео: как проходит урок"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <button
              type="button"
              aria-label="Воспроизвести видео"
              className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-primary/30 min-h-[44px] min-w-[44px]"
              onClick={handlePlay}
              disabled={busy}
            >
              {busy ? (
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

      {/* Сообщение об ошибке + ссылка на открытие файла (если src уже известен) */}
      {err && (
        <div className="absolute bottom-2 left-2 right-2 text-[13px] text-red-200 bg-black/55 rounded-md px-2 py-1 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" />
          {err}
          {src ? (
            <a
              className="underline ml-2"
              href={src}
              target="_blank"
              rel="noopener"
            >
              Открыть как файл
            </a>
          ) : (
            <a
              className="underline ml-2"
              href={YANDEX_PUBLIC_LINK}
              target="_blank"
              rel="noopener"
            >
              Открыть на Я.Диске
            </a>
          )}
        </div>
      )}
    </div>
  );
}
