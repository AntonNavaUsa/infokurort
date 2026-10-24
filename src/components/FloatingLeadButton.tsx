import { Link, useLocation } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { LEAD_FORM_HREF, withTrailingSlash } from "@/components/layout/nav";

/** Плавающая кнопка заявки на мобильных: вход в воронку с любой страницы. */
export function FloatingLeadButton() {
  const { pathname } = useLocation();
  if (withTrailingSlash(pathname) === "/map/") return null;

  return (
    <Link
      to={LEAD_FORM_HREF}
      className="fixed inset-x-4 bottom-4 z-40 flex h-12 items-center justify-center gap-2 rounded-xl bg-warm text-[15px] font-semibold text-warm-foreground shadow-elevated transition-transform active:scale-[0.98] sm:hidden"
    >
      <UserCheck className="h-5 w-5" />
      Подобрать инструктора
    </Link>
  );
}
