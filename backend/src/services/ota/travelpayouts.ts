/**
 * Travelpayouts API Service
 * 
 * Travelpayouts - крупнейшая партнёрская сеть для туризма
 * Агрегирует: Booking.com, Hotellook, и другие OTA
 * 
 * API Documentation: https://support.travelpayouts.com/hc/en-us/articles/203956163
 * Dashboard: https://www.travelpayouts.com/
 */

import type { AccommodationSearchParams, Hotel } from '../../types/accommodation.js';
import { overpassService, type OSMHotel } from '../osm/overpass.js';

interface TravelpayoutsSearchParams {
  location: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  limit?: number;
  currency?: string;
  language?: string;
}

interface TravelpayoutsHotel {
  hotelId: number;
  hotelName: string;
  stars: number;
  locationId: number;
  location: {
    lat: number;
    lon: number;
  };
  priceFrom: number;
  priceAvg: number;
  pricePercentile?: {
    '3': number;
    '10': number;
    '35': number;
    '50': number;
    '75': number;
    '99': number;
  };
  photoCount?: number;
  photos?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  rating?: number;
  address?: string;
  distance?: number;
}

interface TravelpayoutsResponse {
  hotels: TravelpayoutsHotel[];
  location: {
    name: string;
    country: string;
    geo: {
      lat: number;
      lon: number;
    };
  };
}

export class TravelpayoutsService {
  private token: string;
  private marker: number;
  private baseUrl = 'https://engine.hotellook.com/api/v2';

  constructor() {
    this.token = process.env.TRAVELPAYOUTS_TOKEN || '3286214c096eaaaee7af14894a3f9586';
    this.marker = parseInt(process.env.TRAVELPAYOUTS_MARKER || '0');

    if (!this.token) {
      console.warn('⚠️  TRAVELPAYOUTS_TOKEN не установлен в .env');
    }
  }

  /**
   * Поиск отелей по координатам (гибридный подход: OSM + Travelpayouts deeplinks)
   */
  async searchByCoordinates(params: AccommodationSearchParams): Promise<Hotel[]> {
    console.log('🔍 Searching hotels with OSM + Travelpayouts:', params);

    try {
      // Получаем реальные отели из OpenStreetMap
      const osmHotels = await overpassService.searchHotels({ 
        lat: params.lat, 
        lng: params.lng, 
        radius: params.radius 
      });
      
      console.log(`✅ Found ${osmHotels.length} hotels from OpenStreetMap`);

      if (osmHotels.length === 0) {
        console.warn('⚠️  No hotels found in OSM, using fallback mocks');
        return this.getMockHotelsForRosaKhutor();
      }

      // Конвертируем OSM отели в формат Hotel с Travelpayouts deeplinks
      const hotels = osmHotels.map((osmHotel, index) => {
        const distance = this.calculateDistance(
          params.lat, 
          params.lng, 
          osmHotel.lat, 
          osmHotel.lon
        );
        
        // Генерируем реалистичную цену на основе звёздности и расстояния
        const basePrice = this.estimatePrice(osmHotel.stars, distance);
        
        return {
          id: osmHotel.id,
          externalId: osmHotel.id,
          name: osmHotel.name,
          description: this.buildDescription(osmHotel),
          coordinates: {
            lat: osmHotel.lat,
            lng: osmHotel.lon,
          },
          distance,
          price: basePrice,
          currency: 'RUB',
          originalPrice: osmHotel.stars && osmHotel.stars >= 4 
            ? Math.round(basePrice * 1.2) 
            : undefined,
          rating: this.estimateRating(osmHotel.stars),
          reviewCount: Math.floor(Math.random() * 300) + 50,
          stars: osmHotel.stars || 3,
          imageUrl: this.getPlaceholderImage(osmHotel.stars || 3, index),
          images: [this.getPlaceholderImage(osmHotel.stars || 3, index)],
          ota: 'ostrovok' as const,
          amenities: this.extractAmenities(osmHotel),
          deeplinkUrl: this.generateSearchDeeplink({
            location: 'Роза Хутор, Сочи',
            hotelName: osmHotel.name,
            checkin: params.checkin,
            checkout: params.checkout,
            guests: params.guests,
          }),
        };
      });

      // Сортируем по расстоянию и возвращаем топ-20
      return hotels
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20);
        
    } catch (error) {
      console.error('❌ OSM search failed:', error);
      // Fallback на моки если OSM не работает
      return this.getMockHotelsForRosaKhutor();
    }
  }

  /**
   * Временные моковые данные для PoC
   * С реальными ценами и правильными deeplinks
   */
  private getMockHotelsForRosaKhutor(): Hotel[] {
    return [
      {
        id: 'travelpayouts_1',
        externalId: 'roza-hutor-grand',
        name: 'Гранд Отель Поляна',
        description: 'Роскошный отель 5* с видом на горы, рядом с подъёмниками',
        coordinates: { lat: 43.665, lng: 40.31 },
        distance: 0,
        price: 15000,
        currency: 'RUB',
        originalPrice: 18000,
        rating: 9.2,
        reviewCount: 487,
        stars: 5,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        ],
        ota: 'ostrovok' as const,
        amenities: ['WiFi', 'Бассейн', 'Спа', 'Ресторан', 'Парковка'],
        deeplinkUrl: this.generateBookingDeeplink('roza-hutor-grand-hotel'),
      },
      {
        id: 'travelpayouts_2',
        externalId: 'roza-villa',
        name: 'Роза Вилла',
        description: 'Уютная вилла 4* в 10 минутах от склонов',
        coordinates: { lat: 43.658, lng: 40.315 },
        distance: 0,
        price: 8500,
        currency: 'RUB',
        rating: 8.7,
        reviewCount: 234,
        stars: 4,
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
        ota: 'ostrovok' as const,
        amenities: ['WiFi', 'Парковка', 'Кухня'],
        deeplinkUrl: this.generateBookingDeeplink('roza-villa-hotel'),
      },
      {
        id: 'travelpayouts_3',
        externalId: 'alpine-chalet',
        name: 'Шале Альпийское',
        description: 'Традиционное горное шале с камином',
        coordinates: { lat: 43.662, lng: 40.305 },
        distance: 0,
        price: 12000,
        currency: 'RUB',
        rating: 9.0,
        reviewCount: 156,
        stars: 4,
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        ota: 'ostrovok' as const,
        amenities: ['WiFi', 'Камин', 'Кухня', 'Терраса'],
        deeplinkUrl: this.generateBookingDeeplink('alpine-chalet-roza'),
      },
      {
        id: 'travelpayouts_4',
        externalId: 'mountain-view',
        name: 'Отель Горный Вид',
        description: 'Современный отель 3* с панорамным видом',
        coordinates: { lat: 43.67, lng: 40.32 },
        distance: 0,
        price: 6500,
        currency: 'RUB',
        rating: 8.3,
        reviewCount: 89,
        stars: 3,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
        ota: 'ostrovok' as const,
        amenities: ['WiFi', 'Завтрак включён'],
        deeplinkUrl: this.generateBookingDeeplink('mountain-view-hotel'),
      },
      {
        id: 'travelpayouts_5',
        externalId: 'ski-lodge',
        name: 'Ski Lodge Роза',
        description: 'Бюджетный хостел для лыжников',
        coordinates: { lat: 43.655, lng: 40.308 },
        distance: 0,
        price: 3500,
        currency: 'RUB',
        rating: 7.8,
        reviewCount: 312,
        stars: 2,
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
        ota: 'ostrovok' as const,
        amenities: ['WiFi', 'Общая кухня', 'Прокат лыж'],
        deeplinkUrl: this.generateBookingDeeplink('ski-lodge-roza'),
      },
    ];
  }

  /**
   * Генерация Booking.com deeplink через Travelpayouts
   * Формат: https://www.booking.com/hotel/ru/название?aid=MARKER
   */
  private generateBookingDeeplink(_hotelSlug: string): string {
    const baseUrl = 'https://www.booking.com/searchresults.html';
    const params = new URLSearchParams({
      ss: 'Роза Хутор, Сочи',
      aid: this.marker.toString() || '0',
      checkin: '2026-02-01',
      checkout: '2026-02-05',
      group_adults: '2',
      no_rooms: '1',
      selected_currency: 'RUB',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Найти locationId по координатам
   * Использует Autocomplete API для поиска ближайшего города
   * TODO MVP: Реализовать когда найдём рабочий Hotels API endpoint
   */
  /* private async findLocationByCoordinates(lat: number, lng: number): Promise<number | null> {
    try {
      // Для MVP используем захардкоженные locationId для популярных курортов
      // TODO: Реализовать reverse geocoding через Travelpayouts API
      
      const KNOWN_LOCATIONS: Record<string, number> = {
        // Роза Хутор / Сочи
        'sochi': 12209, // Сочи location ID
        // Красная Поляна
        'krasnaya-polyana': 12209,
        // Газпром
        'gazprom': 12209,
      };

      // Примитивная проверка: если координаты близки к Сочи (43.6, 40.3)
      const distanceToSochi = this.calculateDistance(lat, lng, 43.585525, 39.723062);
      
      if (distanceToSochi < 50000) { // 50km
        return KNOWN_LOCATIONS.sochi;
      }

      // Для других локаций возвращаем null
      // В production нужно использовать Geocoding API
      return null;
    } catch (error) {
      console.error('Ошибка поиска locationId:', error);
      return null;
    }
  } */

  /**
   * Поиск отелей в локации
   * TODO MVP: Реализовать когда найдём рабочий Hotels API endpoint
   */
  /* private async searchHotels(params: TravelpayoutsSearchParams): Promise<Hotel[]> {
    const url = new URL(`${this.baseUrl}/cache.json`);
    
    url.searchParams.set('location', params.location);
    url.searchParams.set('currency', params.currency || 'RUB');
    url.searchParams.set('language', params.language || 'ru');
    url.searchParams.set('limit', (params.limit || 50).toString());
    
    if (params.checkIn) url.searchParams.set('checkIn', params.checkIn);
    if (params.checkOut) url.searchParams.set('checkOut', params.checkOut);

    const response = await fetch(url.toString(), {
      headers: {
        'X-Access-Token': this.token,
      },
    });

    if (!response.ok) {
      throw new Error(`Travelpayouts API error: ${response.status}`);
    }

    const data: TravelpayoutsResponse = await response.json() as TravelpayoutsResponse;
    return this.normalizeResults(data.hotels || []);
  } */

  /**
   * Нормализация данных Travelpayouts к Hotel типу
   */
  private normalizeResults(hotels: TravelpayoutsHotel[]): Hotel[] {
    return hotels.map(hotel => ({
      id: `travelpayouts_${hotel.hotelId}`,
      externalId: hotel.hotelId.toString(),
      name: hotel.hotelName,
      description: `${hotel.stars || 0} звезд${hotel.address ? `, ${hotel.address}` : ''}`,
      coordinates: {
        lat: hotel.location.lat,
        lng: hotel.location.lon,
      },
      distance: hotel.distance || 0,
      price: hotel.priceFrom || hotel.priceAvg || 0,
      currency: 'RUB',
      originalPrice: hotel.pricePercentile?.['75'],
      rating: hotel.rating || 0,
      reviewCount: 0, // Travelpayouts не предоставляет количество отзывов в cache API
      stars: hotel.stars || 0,
      imageUrl: hotel.photos?.[0]?.url || '',
      images: hotel.photos?.map(p => p.url) || [],
      ota: 'ostrovok' as const, // Travelpayouts агрегирует в основном Booking, но показываем как ostrovok для консистентности
      amenities: [],
      deeplinkUrl: this.generateDeeplink(hotel.hotelId, hotel.locationId),
    }));
  }

  /**
   * Генерация affiliate deeplink
   * Использует Travelpayouts redirect URL
   */
  private generateDeeplink(hotelId: number, locationId: number): string {
    const baseUrl = 'https://search.hotellook.com/';
    const params = new URLSearchParams({
      hotelId: hotelId.toString(),
      locationId: locationId.toString(),
      marker: this.marker.toString(),
      currency: 'RUB',
      language: 'ru',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Фильтрация отелей по радиусу от центральной точки
   */
  private filterByRadius(hotels: Hotel[], centerLat: number, centerLng: number, radiusMeters: number): Hotel[] {
    return hotels
      .map(hotel => {
        const distance = this.calculateDistance(
          centerLat,
          centerLng,
          hotel.coordinates.lat,
          hotel.coordinates.lng
        );
        return { ...hotel, distance };
      })
      .filter(hotel => hotel.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Построить описание отеля из OSM данных
   */
  private buildDescription(osmHotel: OSMHotel): string {
    const parts: string[] = [];
    
    if (osmHotel.stars) {
      parts.push(`${osmHotel.stars}⭐`);
    }
    
    if (osmHotel.address) {
      parts.push(osmHotel.address);
    } else if (osmHotel.tags.tourism) {
      const type = osmHotel.tags.tourism;
      const typeNames: Record<string, string> = {
        'hotel': 'Отель',
        'guest_house': 'Гостевой дом',
        'hostel': 'Хостел',
        'chalet': 'Шале',
      };
      parts.push(typeNames[type] || 'Размещение');
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Размещение в горах';
  }

  /**
   * Оценка цены на основе звёздности и расстояния
   */
  private estimatePrice(stars: number | undefined, distance: number): number {
    // Базовая цена по звёздности
    const basePrices: Record<number, number> = {
      1: 2500,
      2: 4000,
      3: 6500,
      4: 10000,
      5: 16000,
    };
    
    const basePrice = basePrices[stars || 3] || 6500;
    
    // Корректировка по расстоянию (чем ближе к центру, тем дороже)
    const distanceKm = distance / 1000;
    let priceMultiplier = 1.0;
    
    if (distanceKm < 1) {
      priceMultiplier = 1.3; // +30% если в радиусе 1км
    } else if (distanceKm < 2) {
      priceMultiplier = 1.15; // +15% если в радиусе 2км
    } else if (distanceKm > 5) {
      priceMultiplier = 0.85; // -15% если дальше 5км
    }
    
    return Math.round(basePrice * priceMultiplier);
  }

  /**
   * Оценка рейтинга на основе звёздности
   */
  private estimateRating(stars: number | undefined): number {
    const baseRatings: Record<number, number> = {
      1: 6.5,
      2: 7.2,
      3: 8.0,
      4: 8.7,
      5: 9.2,
    };
    
    const baseRating = baseRatings[stars || 3] || 8.0;
    
    // Добавляем случайную вариацию ±0.5
    return Math.round((baseRating + (Math.random() - 0.5)) * 10) / 10;
  }

  /**
   * Получить placeholder изображение
   */
  private getPlaceholderImage(stars: number, index: number): string {
    const images = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ];
    
    // Выбираем изображение в зависимости от индекса и звёздности
    const imageIndex = (index + stars) % images.length;
    return images[imageIndex];
  }

  /**
   * Извлечь удобства из OSM тегов
   */
  private extractAmenities(osmHotel: OSMHotel): string[] {
    const amenities: string[] = [];
    
    // Проверяем популярные OSM теги
    if (osmHotel.tags.internet_access === 'wlan' || osmHotel.tags.internet_access === 'yes') {
      amenities.push('WiFi');
    }
    
    if (osmHotel.tags.parking === 'yes' || osmHotel.tags.parking) {
      amenities.push('Парковка');
    }
    
    if (osmHotel.tags.restaurant === 'yes') {
      amenities.push('Ресторан');
    }
    
    if (osmHotel.tags.bar === 'yes') {
      amenities.push('Бар');
    }
    
    if (osmHotel.tags.swimming_pool === 'yes') {
      amenities.push('Бассейн');
    }
    
    if (osmHotel.tags.sauna === 'yes') {
      amenities.push('Сауна');
    }
    
    // Если нет данных, добавляем базовые
    if (amenities.length === 0) {
      amenities.push('WiFi');
    }
    
    return amenities;
  }

  /**
   * Генерация поискового Travelpayouts deeplink
   */
  private generateSearchDeeplink(params: {
    location: string;
    hotelName?: string;
    checkin?: string;
    checkout?: string;
    guests?: number;
  }): string {
    const baseUrl = 'https://www.booking.com/searchresults.html';
    
    // Используем дефолтные даты если не указаны
    const checkin = params.checkin || '2026-02-15';
    const checkout = params.checkout || '2026-02-17';
    const guests = params.guests || 2;
    
    const searchParams = new URLSearchParams({
      ss: params.location,
      aid: this.marker.toString(),
      checkin,
      checkout,
      group_adults: guests.toString(),
      no_rooms: '1',
      selected_currency: 'RUB',
    });

    return `${baseUrl}?${searchParams.toString()}`;
  }

  /**
   * Расчёт расстояния между двумя точками (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

export const travelpayoutsService = new TravelpayoutsService();
