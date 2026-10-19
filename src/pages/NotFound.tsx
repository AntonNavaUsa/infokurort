import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { navItems } from "@/components/layout/nav";
import { InfoMark } from "@/components/layout/InfoMark";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-20 md:py-28">
        <InfoMark className="h-12 w-12" />
        <p className="tabular mt-6 text-sm font-semibold text-primary">Ошибка 404</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Такой страницы в справочной нет</h1>
        <p className="mt-4 text-lg text-muted-foreground">Возможно, адрес изменился. Вот разделы, которые есть сейчас:</p>
        <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
          {[{ href: "/", label: "Главная справочной" }, ...navItems].map((item) => (
            <li key={item.href}>
              <Link to={item.href} className="group flex items-center justify-between px-5 py-4 font-medium hover:text-primary">
                {item.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default NotFound;
