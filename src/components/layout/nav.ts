import { BedDouble, Info, Mountain, Ticket, Users } from "lucide-react";

export const navItems = [
  { href: "/instruktory/", label: "Инструкторы и школы", short: "Инструкторы", icon: Users },
  { href: "/ski-passes/", label: "Ски-пассы", short: "Ски-пассы", icon: Ticket },
  { href: "/freeride/", label: "Фрирайд", short: "Фрирайд", icon: Mountain },
  { href: "/hotels/", label: "Где жить", short: "Где жить", icon: BedDouble },
  { href: "/about/", label: "О справочной", short: "О справочной", icon: Info },
];

export const LEAD_FORM_HREF = "/instruktory/#podbor";

/** Канонический вид пути: со слэшем на конце, как его отдаёт Nginx (`/instruktory/`). */
export const withTrailingSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);
