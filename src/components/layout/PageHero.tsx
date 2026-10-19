import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CalendarCheck } from "lucide-react";
import { Photo } from "@/components/Photo";
import type { PhotoData } from "@/data/photos";
import { formatRuDate, site } from "@/data/site";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  updated?: string | false;
  image?: PhotoData;
  children?: ReactNode;
};

/** Заголовок раздела в стиле табличек визит-центра: пиктограмма, метка, H1, короткий ответ и фото. */
export function PageHero({ icon: Icon, eyebrow, title, lead, updated = site.contentUpdated, image, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[image:var(--gradient-frost)]">
      <div
        className={cn(
          "container relative mx-auto px-4 py-12 md:py-16",
          image && "grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center",
        )}
      >
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

        {image && (
          <Photo
            photo={image}
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[16/10] rounded-2xl shadow-elevated ring-1 ring-black/5 lg:aspect-[4/3]"
          />
        )}
      </div>
    </section>
  );
}
