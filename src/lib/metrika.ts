const METRIKA_ID = 106417063;

type YandexMetrika = (id: number, method: "reachGoal", goal: string, params?: Record<string, unknown>) => void;

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  const ym = (window as Window & { ym?: YandexMetrika }).ym;
  if (typeof ym === "function") {
    ym(METRIKA_ID, "reachGoal", goal, params);
  }
}
