import { useState, useCallback } from 'react';
import { MapWidget } from '@/components/map/MapWidget';
import { FilterPanel, FilterValues } from '@/components/map/FilterPanel';
import { Card, CardContent } from '@/components/ui/card';
import { useAccommodationSearch } from '@/hooks/useAccommodationSearch';
import { accommodationAPI } from '@/lib/api/accommodation';
import type { Hotel } from '@/types/accommodation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

// Дефолтные координаты: Роза Хутор
const DEFAULT_CENTER = {
  lat: 43.66,
  lng: 40.31,
};

/*
// MOCK_HOTELS больше не используется - данные приходят из API
// Закомментировано для истории
const MOCK_HOTELS: Hotel[] = [
  {
    id: 'test-1',
    externalId: 'booking-123',
    name: 'Гранд Отель Поляна',
    description: 'Роскошный отель с видом на горы',
    coordinates: { lat: 43.665, lng: 40.31 },
    distance: 500,
    price: 15000,
    currency: 'RUB',
    originalPrice: 18000,
    rating: 9.2,
    reviewCount: 487,
    stars: 5,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    ota: 'ostrovok' as const,
    amenities: ['WiFi', 'Бассейн', 'Спа'],
    deeplinkUrl: 'https://ostrovok.ru/hotel/grand-polyana',
  },
  {
    id: 'test-2',
    externalId: 'booking-456',
    name: 'Роза Вилла',
    description: 'Уютная вилла рядом с подъемниками',
    coordinates: { lat: 43.658, lng: 40.315 },
    distance: 1200,
    price: 8500,
    currency: 'RUB',
    rating: 8.7,
    reviewCount: 234,
    stars: 4,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
    ota: 'ostrovok' as const,
    amenities: ['WiFi', 'Парковка'],
    deeplinkUrl: 'https://ostrovok.ru/hotel/roza-villa',
  },
  {
    id: 'test-3',
    externalId: 'expedia-789',
    name: 'Шале Альпийское',
    description: 'Традиционное горное шале',
    coordinates: { lat: 43.662, lng: 40.305 },
    distance: 800,
    price: 12000,
    currency: 'RUB',
    rating: 9.0,
    reviewCount: 156,
    stars: 4,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    ota: 'sutochno' as const,
    amenities: ['WiFi', 'Камин', 'Кухня'],
    deeplinkUrl: 'https://sutochno.ru/alpine-chalet',
  },
];
*/

export default function AccommodationMap() {
  const [filters, setFilters] = useState<FilterValues>({
    sortBy: 'distance',
  });

  // Используем реальный API вместо моков
  const { data, loading, error } = useAccommodationSearch({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    radius: 5000,
  });

  const hotels = data?.results || [];

  // Apply filters and sorting
  const filteredHotels = useCallback(() => {
    let result = [...hotels];

    // Price filter
    if (filters.minPrice !== undefined) {
      result = result.filter((h) => h.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((h) => h.price <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      result = result.filter((h) => h.rating >= filters.minRating!);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [hotels, filters]);

  const handleHotelClick = async (hotel: Hotel) => {
    // Track click
    try {
      await accommodationAPI.trackClick({
        widgetId: 'demo-widget-id', // TODO: Get from URL params
        hotelId: hotel.id,
        hotelName: hotel.name,
        ota: hotel.ota,
        price: hotel.price,
        currency: hotel.currency,
      });
    } catch (err) {
      console.error('Failed to track click:', err);
    }

    // Open booking link
    window.open(hotel.deeplinkUrl, '_blank');
  };

  const displayedHotels = filteredHotels();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Где остановиться</h1>
        <p className="text-muted-foreground">
          Найдите идеальное жильё рядом с курортом
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            priceRange={{ min: 0, max: 20000 }}
          />

          {/* Results Count */}
          {!loading && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Найдено отелей: <span className="font-semibold">{displayedHotels.length}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="flex items-center justify-center h-[600px] bg-muted rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Поиск отелей...</span>
            </div>
          )}

          {!loading && !error && (
            <MapWidget
              center={DEFAULT_CENTER}
              hotels={displayedHotels}
              onHotelClick={handleHotelClick}
            />
          )}

          {/* Hotel Cards List (optional, for mobile) */}
          <div className="mt-6 lg:hidden space-y-4">
            {displayedHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} onClick={handleHotelClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple hotel card for mobile view
function HotelCard({ hotel, onClick }: { hotel: Hotel; onClick: (hotel: Hotel) => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onClick(hotel)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-24 h-24 object-cover rounded-md"
          />
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-1">{hotel.name}</h3>
            <p className="text-sm text-muted-foreground">
              {hotel.rating.toFixed(1)}⭐ • {(hotel.distance / 1000).toFixed(1)} км
            </p>
            <p className="text-lg font-bold mt-2">
              {hotel.price} {hotel.currency}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
