import { Link } from "react-router-dom";
import { formatRuDate, site } from "@/data/site";
import { InfoMark } from "./InfoMark";
import { LEAD_FORM_HREF, navItems } from "./nav";

export function Footer() {
  return (
    <footer className="bg-mountain-dark text-white/80">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-3">
            <InfoMark className="h-9 w-9" />
            <span className="text-lg font-bold text-white">Инфокурорт</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            Справочная Красной Поляны: Роза Хутор, Красная Поляна и Газпром в одном формате — факты, правила и ссылки на первоисточники.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Разделы</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="transition-colors hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Помощь с поездкой</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to={LEAD_FORM_HREF} className="transition-colors hover:text-white">Подобрать инструктора</Link></li>
            <li><Link to="/instruktory#calculator" className="transition-colors hover:text-white">Калькулятор занятий</Link></li>
            <li><Link to="/ski-passes" className="transition-colors hover:text-white">Калькулятор ски-пасса</Link></li>
            <li><Link to="/map" className="transition-colors hover:text-white">Карта жилья</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-2 px-4 pb-24 pt-5 text-xs text-white/50 sm:pb-5 md:flex-row md:items-center md:justify-between">
          <p>Независимый информационный сервис, не является сайтом курортов. Условия и цены уточняйте у первоисточника.</p>
          <p className="shrink-0">Справка обновлена {formatRuDate(site.contentUpdated)} · © {new Date().getFullYear()} infokurort.ru</p>
        </div>
      </div>
    </footer>
  );
}
