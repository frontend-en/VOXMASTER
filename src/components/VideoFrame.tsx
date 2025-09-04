import { useEffect, useRef, useState, useCallback } from "react";
import { AlertTriangle, Loader2, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { videoposter } from "../assets";

const YANDEX_PUBLIC_LINK = "https://disk.yandex.ru/i/502IKE7FV5nqCw";

/** ----- perf & reliability helpers ----- */
const STORAGE_KEY = "ya_video_src_v1";
const STORAGE_TTL_MS = 30 * 60 * 1000; // 30 мин — прямые ссылки живут ограниченно

function setCache(url: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ url, ts: Date.now() }));
  } catch {}
}
function getCache(): string | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { url, ts } = JSON.parse(raw);
    if (!url || !ts || Date.now() - ts > STORAGE_TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return url as string;
  } catch {
    return null;
  }
}

function link(rel: string, href: string, extra?: Partial<HTMLLinkElement>) {
  const el = document.createElement("link");
  el.rel = rel;
  el.href = href;
  if (extra) Object.assign(el, extra);
  document.head.appendChild(el);
  return el;
}

function prewarmOrigins() {
  // Прогреваем DNS/соединение к API и типовым CDN узлам Я.Диска
  const origins = [
    "https://cloud-api.yandex.net",
    "https://downloader.disk.yandex.ru",
    "https://yadi.sk",
  ];
  origins.forEach((href) => {
    link("dns-prefetch", href);
    link("preconnect", href, { crossOrigin: "anonymous" as any });
  });
}

function preconnectFor(url: string) {
  try {
    const { origin } = new URL(url);
    link("dns-prefetch", origin);
    link("preconnect", origin, { crossOrigin: "anonymous" as any });
  } catch {}
}

/** (Осторожно) Предзагрузка видео: даёт быстрый старт, но ест трафик.
 * Уважаем Data Saver: если включён — не прелоадим. */
function maybePreloadVideo(url: string) {
  // @ts-ignore
  const saveData = navigator?.connection?.saveData;
  if (saveData) return;
  link("preload", url, {
    as: "video",
    crossOrigin: "anonymous" as any,
    // type можно не ставить (у Я.Диска линк без расширения), но не мешает:
    // type: "video/mp4",
  });
}

/** fetch с таймаутом */
async function fetchWithTimeout(url: string, ms = 8000, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

/** резолв прямого URL с ретраями */
async function resolveYandexDirectUrl(publicLink: string): Promise<string | null> {
  const api = "https://cloud-api.yandex.net/v1/disk/public/resources/download";
  const url = `${api}?public_key=${encodeURIComponent(publicLink)}`;
  const attempts = 3;

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetchWithTimeout(url, 8000, { method: "GET" });
      if (!res.ok) {
        console.error("Yandex API error:", res.status, res.statusText);
        if (res.status >= 500) throw new Error("server"); // ретраим 5xx
        return null;
      }
      const data = await res.json();
      if (data?.href) return data.href as string;
      console.error("No href in response:", data);
      return null;
    } catch (e) {
      const base = 300; // ms
      const jitter = Math.floor(Math.random() * 200);
      await new Promise((r) => setTimeout(r, base * (i + 1) + jitter));
      if (i === attempts - 1) {
        console.error("resolveYandexDirectUrl failed:", e);
        return null;
      }
    }
  }
  return null;
}

/** мягко получить (кэш → API) */
async function ensureDirectUrl(): Promise<string | null> {
  const cached = getCache();
  if (cached) return cached;
  const direct = await resolveYandexDirectUrl(YANDEX_PUBLIC_LINK);
  if (direct) setCache(direct);
  return direct;
}

/** ----- Component ----- */
export function VideoFrame() {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null); // прямой URL заранее
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false); // спиннер для резолва/задержек
  const [err, setErr] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Hero: резолвим сразу после монтирования (без скролла)
  useEffect(() => {
    prewarmOrigins();
    let alive = true;
    (async () => {
      const direct = await ensureDirectUrl();
      if (!alive) return;
      if (direct) {
        setResolvedSrc(direct);
        preconnectFor(direct);
        // для быстрого старта: (вежливо к Data Saver)
        maybePreloadVideo(direct);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handlePlay = useCallback(async () => {
    try {
      setErr(null);
      setBusy(true);

      let url = resolvedSrc;
      if (!url) {
        // Редкий кейс: не успели дорезолвить к клику
        url = await ensureDirectUrl();
      }
      if (!url) {
        setErr("Не удалось получить прямую ссылку с Яндекс.Диска.");
        return;
      }

      // Вставляем src и запускаем
      setResolvedSrc(url); // на всякий
      setPlaying(true);
      requestAnimationFrame(() => {
        const v = videoRef.current;
        v?.play().catch(() => {
          /* пользователь сам нажмёт play */
        });
      });
    } catch (e) {
      console.error(e);
      setErr("Не удалось получить прямую ссылку с Яндекс.Диска.");
    } finally {
      setBusy(false);
    }
  }, [resolvedSrc]);

  return (
    <div className="relative w-full aspect-video bg-card border border-border/20 rounded-[18px] overflow-hidden group">
      {/* Видео под постером: если есть прямой линк — даём браузеру заранее подтянуть metadata */}
      {resolvedSrc && (
        <video
          ref={videoRef}
          src={resolvedSrc}
          // До клика прячем контролы и оставляем preload=metadata для быстрого старта
          controls={playing}
          preload="metadata"
          playsInline
          poster={videoposter}
          crossOrigin="anonymous"
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          onCanPlay={() => {
            // если пользователь уже нажал — стартуем максимально быстро
            if (playing) {
              videoRef.current?.play().catch(() => {});
            }
          }}
          onWaiting={() => setBusy(true)}
          onPlaying={() => setBusy(false)}
          onStalled={() => setBusy(true)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            setErr("Видео не смогло воспроизвестись в этом браузере.");
            setPlaying(false);
          }}
          // Доп опции контроля (по желанию):
          // controlsList="nodownload"
          // disablePictureInPicture
        >
          Ваш браузер не поддерживает видео.
        </video>
      )}

      {/* Постер + кнопка Play поверх */}
      {!playing && (
        <>
          <ImageWithFallback
            src={videoposter}
            alt="Видео: как проходит урок"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <button
              className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-primary/30 min-h-[44px] min-w-[44px]"
              aria-label="Воспроизвести видео"
              onClick={handlePlay}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="w-7 h-7 animate-spin text-primary-foreground" />
              ) : (
                <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
              )}
            </button>
          </div>
        </>
      )}

      {/* Ошибка */}
      {err && (
        <div className="absolute bottom-2 left-2 right-2 text-[13px] text-red-200 bg-black/55 rounded-md px-2 py-1 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" />
          {err}{" "}
          <a
            className="underline ml-1"
            href={resolvedSrc || "#"}
            target="_blank"
            rel="noopener"
            onClick={(e) => {
              if (!resolvedSrc) e.preventDefault();
            }}
          >
            Открыть как файл
          </a>
        </div>
      )}
    </div>
  );
}
