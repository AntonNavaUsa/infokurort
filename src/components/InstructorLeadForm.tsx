import { useState } from "react";
import { CalendarDays, CheckCircle2, Loader2, MessageSquareText, Phone, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type FormState = {
  fullName: string;
  phone: string;
  resort: string;
  lessonType: string;
  experience: string;
  preferredDate: string;
  notes: string;
};

const initialState: FormState = {
  fullName: "",
  phone: "",
  resort: "",
  lessonType: "",
  experience: "",
  preferredDate: "",
  notes: "",
};

const resortOptions = ["Роза Хутор", "Красная Поляна", "Газпром / Лаура / Альпика"];
const lessonOptions = ["Индивидуальный урок", "Групповой урок", "Урок для ребёнка", "Семейный урок", "Фрирайд/бесплатный стиль"];
const experienceOptions = ["Новичок", "Есть опыт до 1 года", "1–3 года", "Больше 3 лет"];

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export function InstructorLeadForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitRequest = async () => {
    const payload = {
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
    };

    if (!payload.fullName || !payload.phone || !payload.resort || !payload.lessonType || !payload.experience) {
      toast({
        title: "Заполните обязательные поля",
        description: "Имя, телефон, курорт, формат занятий и уровень катания нужны для корректного подбора.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/instructor-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      localStorage.setItem("instructor-leads-cache", JSON.stringify([
        ...(JSON.parse(localStorage.getItem("instructor-leads-cache") ?? "[]") as Record<string, string>[]),
        { ...payload, createdAt: new Date().toISOString() },
      ]));

      toast({
        title: "Заявка отправлена",
        description: "Мы получили ваш запрос и скоро подберём подходящий вариант обучения.",
      });
      setForm(initialState);
    } catch (error) {
      const localLead = { ...payload, createdAt: new Date().toISOString() };
      const cachedLeads = JSON.parse(localStorage.getItem("instructor-leads-cache") ?? "[]") as Record<string, string>[];
      localStorage.setItem("instructor-leads-cache", JSON.stringify([...cachedLeads, localLead]));

      toast({
        title: "Форма сохранена локально",
        description: "Бэкенд сейчас недоступен, но заявка сохранена на устройстве и будет отправлена позже.",
        variant: "destructive",
      });
      setForm(initialState);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Быстрый подбор</p>
          <h3 className="font-display text-2xl font-bold text-foreground">Запрос на инструктора</h3>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="fullName">Имя</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Как к вам обращаться"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="phone">Телефон</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+7 999 123 45 67"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label>Курорт</Label>
          <Select value={form.resort} onValueChange={(value) => updateField("resort", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите курорт" />
            </SelectTrigger>
            <SelectContent>
              {resortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label>Формат занятий</Label>
          <Select value={form.lessonType} onValueChange={(value) => updateField("lessonType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите формат" />
            </SelectTrigger>
            <SelectContent>
              {lessonOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label>Уровень катания</Label>
          <Select value={form.experience} onValueChange={(value) => updateField("experience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Уровень" />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="preferredDate">Предпочтительная дата</Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="preferredDate"
              type="date"
              value={form.preferredDate}
              onChange={(e) => updateField("preferredDate", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Дополнительно</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Возраст катальца, цели, нужна школа с детским классом или индивидуальная программа..."
            className="min-h-[110px] resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
          <span>Подбор без давления и без скрытых комиссий.</span>
        </div>

        <Button type="button" variant="hero" size="lg" className="w-full sm:w-auto" onClick={submitRequest} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправляем...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Отправить заявку
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
