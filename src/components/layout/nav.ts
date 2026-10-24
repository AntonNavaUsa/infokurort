import { BedDouble, BusFront, Info, MapPinned, Mountain, Shield, Ticket, Users } from "lucide-react";

export const navItems = [
  { href: "/kurorty/", label: "Курорты", short: "Курорты", icon: Mountain },
  { href: "/instruktory/", label: "Инструкторы и школы", short: "Инструкторы", icon: Users },
  { href: "/ski-passes/", label: "Ски-пассы", short: "Ски-пассы", icon: Ticket },
  { href: "/freeride/", label: "Фрирайд", short: "Фрирайд", icon: Mountain },
  { href: "/transport/", label: "Как добраться", short: "Дорога", icon: BusFront },
  { href: "/parking/", label: "Парковки", short: "Парковка", icon: MapPinned },
  { href: "/hotels/", label: "Где жить", short: "Где жить", icon: BedDouble },
  { href: "/help/", label: "Безопасность и помощь", short: "Помощь", icon: Shield },
  { href: "/about/", label: "О справочной", short: "О справочной", icon: Info },
];

export const LEAD_FORM_HREF = "/instruktory/#podbor";

/** Канонический вид пути: со слэшем на конце, как его отдаёт Nginx (`/instruktory/`). */
export const withTrailingSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);
