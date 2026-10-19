import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InfoMark } from "./InfoMark";
import { LEAD_FORM_HREF, navItems, withTrailingSlash } from "./nav";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location.pathname, location.hash]);

  const isActive = (href: string) => withTrailingSlash(location.pathname).startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <InfoMark className="h-9 w-9" />
            <span className="leading-none">
              <span className="block text-[17px] font-bold tracking-tight text-foreground">Инфокурорт</span>
              <span className="mt-1 block text-[11px] font-medium text-muted-foreground">справочная Красной Поляны</span>
            </span>
          </Link>

          <nav aria-label="Разделы справочной" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.short}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild className="hidden h-10 rounded-lg px-4 font-semibold sm:inline-flex">
              <Link to={LEAD_FORM_HREF}>
                Подобрать инструктора
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isOpen}
              className="rounded-lg lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <nav aria-label="Разделы справочной" className="border-t border-border/70 bg-background lg:hidden">
          <div className="container mx-auto grid gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition-colors",
                  isActive(item.href) ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-muted",
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            ))}
            <Button asChild size="lg" className="mt-2 rounded-lg font-semibold sm:hidden">
              <Link to={LEAD_FORM_HREF}>
                Подобрать инструктора
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
