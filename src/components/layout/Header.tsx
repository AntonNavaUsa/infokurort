import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navItems = [
  { href: "/", label: "Справочная" },
  { href: "/instruktory", label: "Инструкторы" },
  { href: "/ski-passes", label: "Ски-пассы" },
  { href: "/hotels", label: "Где остановиться" },
  { href: "/freeride", label: "Фрирайд" },
  { href: "/about", label: "О проекте" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex shrink-0 items-center gap-2.5 text-slate-900 transition-opacity hover:opacity-80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
              <img src={logo} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
            </span>
            <span>
              <span className="block font-sans text-lg font-bold leading-tight">Инфокурорт</span>
              <span className="block text-[10px] leading-tight text-slate-500">справочная Красной Поляны</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? location.pathname === "/"
                : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-50 text-sky-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 xl:flex">
            <Link to="/instruktory#calculator">
              <Button className="rounded-full bg-sky-700 text-white hover:bg-sky-800">
                Подобрать инструктора
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isOpen}
            className="rounded-full text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isOpen && (
          <nav className="space-y-1 border-t border-slate-100 py-3 lg:hidden">
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? location.pathname === "/"
                : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-50 text-sky-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link to="/instruktory#calculator" onClick={() => setIsOpen(false)} className="block pt-2">
              <Button className="w-full rounded-full bg-sky-700 text-white hover:bg-sky-800">
                Подобрать инструктора
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
