// Единая точка для сезонных пометок и даты обновления справки.
// При актуализации цен/текстов меняйте значения здесь.
export const site = {
  name: "Инфокурорт",
  tagline: "Справочная Красной Поляны",
  season: "2026/27",
  pricesSeason: "2025/26",
  contentUpdated: "2026-10-19",
} as const;

export const formatRuDate = (isoDate: string) =>
  new Date(`${isoDate}T12:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
