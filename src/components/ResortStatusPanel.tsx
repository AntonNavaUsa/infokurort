import { useEffect, useState } from "react";
import { AlertTriangle, CalendarCheck, CloudSun, ExternalLink } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

type ResortStatus = {
  id: number;
  name: string;
  slug: string;
  status: string | null;
  snowDepth: number | null;
  weather: string | null;
  temperature: number | null;
  liftsOpen: number | null;
  liftsTotal: number | null;
  trailsOpen: number | null;
  trailsTotal: number | null;
  website: string | null;
  statusUpdatedAt: string | null;
};

const STATUS_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const statusLabels: Record<string, string> = {
  open: "Открыт",
  closed: "Закрыт",
  partial: "Частично открыт",
};

export function ResortStatusPanel() {
  const [resorts, setResorts] = useState<ResortStatus[]>([]);
  const [loadingError, setLoadingError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resorts`, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: ResortStatus[] = await response.json();
        const now = Date.now();
        setResorts(data.filter((resort) => {
          if (!resort.statusUpdatedAt || !resort.status) return false;
          const updatedAt = new Date(resort.statusUpdatedAt).getTime();
          return Number.isFinite(updatedAt) && now - updatedAt >= 0 && now - updatedAt <= STATUS_MAX_AGE_MS;
        }));
        setLoadingError(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load current resort status", error);
        setLoadingError(true);
      }
    };

    void load();
    return () => controller.abort();
  }, [attempt]);

  if (loadingError) {
    return (
      <section className="container mx-auto px-4 pt-8" aria-live="polite">
        <div className="flex flex-col gap-3 rounded-xl border border-signal/50 bg-signal/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-foreground/80">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-sunset" />
            Не удалось загрузить текущий статус курортов. Проверьте информацию на официальных сайтах.
          </p>
          <button type="button" onClick={() => setAttempt((value) => value + 1)} className="shrink-0 text-sm font-semibold text-primary hover:underline">
            Повторить
          </button>
        </div>
      </section>
    );
  }

  if (resorts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pt-8" aria-labelledby="resort-status-heading">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-warm">Данные, проверенные вручную</p>
            <h2 id="resort-status-heading" className="mt-1 text-2xl font-bold">Сейчас на курорте</h2>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarCheck className="h-3.5 w-3.5" />
            Автоматически скрывается через 24 часа
          </p>
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {resorts.map((resort) => (
            <li key={resort.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{resort.name}</h3>
                  <p className="mt-1 text-sm text-primary">{statusLabels[resort.status ?? ""] ?? resort.status}</p>
                </div>
                {resort.website && (
                  <a href={resort.website} target="_blank" rel="noopener noreferrer" aria-label={`Первоисточник: ${resort.name}`} className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {resort.weather && <span className="inline-flex items-center gap-1"><CloudSun className="h-4 w-4" />{resort.weather}</span>}
                {resort.temperature !== null && <span>{resort.temperature} °C</span>}
                {resort.snowDepth !== null && <span>Снег: {resort.snowDepth} см</span>}
                {resort.liftsOpen !== null && resort.liftsTotal !== null && <span>Подъёмники: {resort.liftsOpen}/{resort.liftsTotal}</span>}
                {resort.trailsOpen !== null && resort.trailsTotal !== null && <span>Трассы: {resort.trailsOpen}/{resort.trailsTotal}</span>}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Обновлено {resort.statusUpdatedAt ? new Date(resort.statusUpdatedAt).toLocaleString("ru-RU") : ""}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Сведения носят справочный характер и могут измениться. Перед выездом проверьте работу трасс и подъёмников у курорта.
        </p>
      </div>
    </section>
  );
}
