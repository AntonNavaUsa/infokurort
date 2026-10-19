import { useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getFirstTouch } from "@/lib/attribution";
import { reachGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

type FormState = {
  resort: string;
  dates: string;
  learner: string;
  childAge: string;
  discipline: string;
  level: string;
  name: string;
  contact: string;
};

const initialState: FormState = {
  resort: "",
  dates: "",
  learner: "",
  childAge: "",
  discipline: "",
  level: "",
  name: "",
  contact: "",
};

const resortOptions = ["Роза Хутор", "Красная Поляна", "Газпром", "Пока не решили"];
const learnerOptions = ["Взрослый", "Ребёнок", "Семья"];
const disciplineOptions = ["Лыжи", "Сноуборд"];
const levelOptions = ["С нуля", "Есть немного опыта", "Уверенно катаюсь"];

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-2 pt-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex h-10 items-center rounded-lg border px-3.5 text-sm font-medium transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                value === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card text-foreground hover:border-primary/50 hover:bg-secondary",
              )}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function InstructorLeadForm({ title = "Подобрать инструктора", footnote }: { title?: string; footnote?: ReactNode }) {
  const { toast } = useToast();
  const { pathname } = useLocation();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const needsChildAge = form.learner === "Ребёнок" || form.learner === "Семья";

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitRequest = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      contact: form.contact.trim(),
      dates: form.dates.trim(),
      childAge: needsChildAge ? form.childAge.trim() : "",
      page: pathname,
      website: honeypot,
      ...getFirstTouch(),
    };

    if (!payload.resort || !payload.learner || !payload.discipline || !payload.level || !payload.name || payload.contact.length < 5) {
      toast({
        title: "Заполните форму",
        description: "Нужны курорт, кто учится, лыжи или сноуборд, уровень, имя и телефон или Telegram.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/instructor-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      reachGoal("lead_form_submit", { resort: payload.resort, page: pathname });
      setIsSent(true);
      setForm(initialState);
    } catch {
      toast({
        title: "Заявка не отправилась",
        description: "Проверьте интернет и попробуйте ещё раз — введённые данные сохранены в форме.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8" role="status">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pine/10 text-pine">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-foreground">Заявка принята</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Свяжемся по указанному контакту, предложим время занятия и назовём цену. Если даты уже заняты — честно скажем и посоветуем аккредитованного коллегу.
        </p>
        <Button variant="outline" className="mt-6 rounded-lg" onClick={() => setIsSent(false)}>
          Отправить ещё одну заявку
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submitRequest} className="relative rounded-2xl border border-border bg-card p-5 shadow-soft md:p-7" noValidate>
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
        <h3 className="text-xl font-bold text-foreground md:text-2xl">{title}</h3>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">≈ 2 минуты</span>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <div className="mt-5 grid gap-5">
        <ChoiceGroup name="resort" legend="Курорт" options={resortOptions} value={form.resort} onChange={(v) => updateField("resort", v)} />

        <div className="grid gap-5 md:grid-cols-2">
          <ChoiceGroup name="discipline" legend="Что осваиваем" options={disciplineOptions} value={form.discipline} onChange={(v) => updateField("discipline", v)} />
          <ChoiceGroup name="learner" legend="Кто учится" options={learnerOptions} value={form.learner} onChange={(v) => updateField("learner", v)} />
        </div>

        <ChoiceGroup name="level" legend="Уровень" options={levelOptions} value={form.level} onChange={(v) => updateField("level", v)} />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-dates">Даты</Label>
            <Input
              id="lead-dates"
              value={form.dates}
              onChange={(e) => updateField("dates", e.target.value)}
              placeholder="Например, 3–6 января"
              className="h-11 rounded-lg"
            />
          </div>
          {needsChildAge && (
            <div className="space-y-2">
              <Label htmlFor="lead-child-age">Возраст ребёнка</Label>
              <Input
                id="lead-child-age"
                value={form.childAge}
                onChange={(e) => updateField("childAge", e.target.value)}
                placeholder="Например, 6 лет"
                className="h-11 rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Имя</Label>
            <Input
              id="lead-name"
              autoComplete="given-name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Как к вам обращаться"
              className="h-11 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-contact">Телефон или Telegram</Label>
            <Input
              id="lead-contact"
              autoComplete="tel"
              value={form.contact}
              onChange={(e) => updateField("contact", e.target.value)}
              placeholder="+7 900 000-00-00 или @username"
              className="h-11 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-xs">
          {footnote ?? "Нажимая «Отправить», вы соглашаетесь на обработку контактных данных для ответа на заявку."}
        </p>
        <Button type="submit" size="lg" className="h-12 w-full rounded-lg px-6 font-semibold sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Отправляем…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Отправить заявку
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
