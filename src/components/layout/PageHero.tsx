import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CalendarCheck } from "lucide-react";
import { formatRuDate, site } from "@/data/site";

type PageHeroProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  updated?: string | false;
  children?: ReactNode;
};

/** Заголовок раздела в стиле табличек визит-центра: пиктограмма, метка, H1, короткий ответ. */
export function PageHero({ icon: Icon, eyebrow, title, lead, updated = site.contentUpdated, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[image:var(--gradient-frost)]">
      <div className="container relative mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-primary">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="h-4 w-4" />
              </span>
              {eyebrow}
            </span>
            {updated && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarCheck className="h-3.5 w-3.5" />
                Обновлено: {formatRuDate(updated)}
              </span>
            )}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-[1.1] text-foreground md:text-5xl">{title}</h1>
          {lead && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead}</p>}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  );
}
