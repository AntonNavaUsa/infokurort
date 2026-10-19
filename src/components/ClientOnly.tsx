import { useEffect, useState, type ReactNode } from "react";

/**
 * Рендерит children только в браузере после гидрации. Нужен для виджетов,
 * которые зависят от текущей даты или window (калькуляторы): в пререндере и
 * при первом проходе гидрации показывается fallback, поэтому разметка совпадает.
 */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

export function WidgetPlaceholder({ title, minHeight = 640 }: { title: string; minHeight?: number }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-lg border-2 border-primary/20 bg-card p-6"
      style={{ minHeight }}
      aria-busy="true"
    >
      <p className="text-2xl font-bold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">Загружаем калькулятор…</p>
    </div>
  );
}
