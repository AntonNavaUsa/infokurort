import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { BedDouble, Map } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/layout/PageHero";

export default function Hotels() {
  useEffect(() => {
    // Загрузка скрипта Яндекс.Путешествия
    const script = document.createElement('script');
    script.src = 'https://aflt.travel.yandex.ru/widgets/api.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Инициализация виджета после загрузки API
    const initWidget = () => {
      if ((window as any).YaTravelAffiliate) {
        (window as any).YaTravelAffiliate.createWidget({
          type: 'hotelsOnMap',
          containerId: 'travelWidget',
          widgetParams: {
            geoId: 10994,
            affiliateClid: '14608723',
          },
          urlParams: {
            origin: 'https://travel.yandex.ru/',
            partner: 'distribution',
            params: {
              affiliate_clid: '14608723',
              service: 'hotelsOnMap',
              utm_source: 'distribution',
              utm_medium: 'cpa',
            },
          },
          theme: 'light',
        });
      }
    };

    const handleLoad = () => {
      window.removeEventListener('YaTravelAffiliateLoaded', handleLoad);
      initWidget();
    };

    if ((window as any).YaTravelAffiliate) {
      initWidget();
    } else {
      window.addEventListener('YaTravelAffiliateLoaded', handleLoad);
    }

    return () => {
      window.removeEventListener('YaTravelAffiliateLoaded', handleLoad);
      // Удаляем скрипт при размонтировании
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-12">
        <PageHero
          icon={BedDouble}
          eyebrow="Где жить"
          title="Где жить в Красной Поляне"
          lead="Отели, апартаменты и гостевые дома рядом с горнолыжными склонами. Поиск и бронирование — через партнёрский виджет Яндекс Путешествий."
          updated={false}
        >
          <Link to="/map" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline hover:underline-offset-4">
            <Map className="h-4 w-4" />
            Посмотреть жильё на карте
          </Link>
        </PageHero>

        <div className="container mx-auto px-4 pt-8">
          {/* Контейнер для виджета Яндекс.Путешествия */}
          <div
            id="travelWidget"
            className="w-full min-h-[600px] overflow-hidden rounded-xl border border-border bg-card shadow-soft"
          ></div>

          <p className="mt-4 text-xs text-muted-foreground">
            Партнёрский виджет: бронирование через партнёрскую программу Яндекс Путешествий.
          </p>
        </div>
      </main>
    </>
  );
}
