// Фотографии с Wikimedia Commons (CC BY-SA / CC BY): обрезаны и сжаты в WebP.
// Лицензия требует указывать автора и лицензию — подпись выводит компонент Photo.
// Свои фото (например, для блока «Ваш инструктор») кладите в public/images и описывайте здесь же.
export type PhotoData = {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
};

const BY_SA_3 = { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
const BY_SA_4 = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };

export const photos = {
  hero: {
    src: "/images/hero-kamenny-stolb-1920.webp",
    srcSet: "/images/hero-kamenny-stolb-960.webp 960w, /images/hero-kamenny-stolb-1920.webp 1920w",
    width: 1920,
    height: 1080,
    alt: "Заснеженная гора Каменный столб — вид с верхней станции Розы Хутор",
    author: "SKas",
    ...BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mountains_in_Krasnaya_Polyana.JPG",
  },
  rozaKhutor: {
    src: "/images/resort-roza-khutor-900.webp",
    width: 900,
    height: 560,
    alt: "Зимняя панорама склонов курорта Роза Хутор",
    author: "Sergei Kazantsev",
    ...BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:RosaKhutor2013.jpg",
  },
  krasnayaPolyana: {
    src: "/images/resort-krasnaya-polyana-900.webp",
    width: 900,
    height: 560,
    alt: "Склоны курорта Красная Поляна (бывшая Горная карусель) зимой",
    author: "Sergei Kazantsev",
    ...BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:GornayaKarusel.JPG",
  },
  gazprom: {
    src: "/images/resort-gazprom-900.webp",
    width: 900,
    height: 560,
    alt: "Канатная дорога 3S курорта Газпром на фоне заснеженного хребта",
    author: "ГОП1389",
    ...BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:%D0%9A%D0%B0%D0%BD%D0%B0%D1%82%D0%BD%D0%B0%D1%8F_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_3S_(A3).jpg",
  },
  instructors: {
    src: "/images/instructors-1200.webp",
    width: 1200,
    height: 800,
    alt: "Инструкторы синхронно выполняют поворот на склоне Розы Хутор",
    author: "SKas",
    ...BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Blue_ski3.jpg",
  },
  freeride: {
    src: "/images/freeride-1200.webp",
    width: 1200,
    height: 800,
    alt: "Лыжник спускается между пихтами на фоне заснеженных гор",
    author: "Sergei Kazantsev",
    ...BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:GornayaKaruselTrassa.JPG",
  },
  skipass: {
    src: "/images/skipass-1200.webp",
    width: 1200,
    height: 800,
    alt: "Верхняя станция подъёмника и заснеженные склоны курорта Красная Поляна",
    author: "Sergei Kazantsev",
    ...BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:GornayaKaruselUp.JPG",
  },
  about: {
    src: "/images/about-1200.webp",
    width: 1200,
    height: 800,
    alt: "Кавказские горы рядом с курортом Роза Хутор",
    author: "Aleksandr Zykov",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Caucasus_Mountains_near_Rosa_Khutor_Alpine_Resort.jpg",
  },
} satisfies Record<string, PhotoData>;
