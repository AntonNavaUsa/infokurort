import { useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";

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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Где жить</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Подберите идеальное жилье для вашего отдыха на курортах Красной Поляны. 
              Отели, апартаменты и гостевые дома рядом с горнолыжными склонами.
            </p>
          </div>

          {/* Контейнер для виджета Яндекс.Путешествия */}
          <div 
            id="travelWidget" 
            className="w-full min-h-[600px] rounded-lg border bg-background shadow-sm"
          ></div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Бронирование осуществляется через партнерскую программу Яндекс.Путешествия
            </p>
          </div>
        </div>
      </div>
      <FloatingChatButton />
    </>
  );
}
