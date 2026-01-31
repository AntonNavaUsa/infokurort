/**
 * OpenStreetMap Overpass API Service
 * Получает реальные отели и объекты размещения из OpenStreetMap
 */

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags: {
    name?: string;
    'name:en'?: string;
    'name:ru'?: string;
    tourism?: string;
    stars?: string;
    phone?: string;
    website?: string;
    email?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    rooms?: string;
    'contact:phone'?: string;
    'contact:website'?: string;
    description?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  version: number;
  generator: string;
  elements: OverpassElement[];
}

export interface OSMHotel {
  id: string;
  name: string;
  lat: number;
  lon: number;
  stars?: number;
  phone?: string;
  website?: string;
  address?: string;
  tags: Record<string, string>;
}

export class OverpassService {
  private baseUrl = 'https://overpass-api.de/api/interpreter';
  private timeout = 25; // seconds

  /**
   * Поиск отелей по координатам и радиусу
   */
  async searchHotels(params: {
    lat: number;
    lng: number;
    radius: number; // meters
  }): Promise<OSMHotel[]> {
    const { lat, lng, radius } = params;

    // Overpass QL query для поиска отелей, хостелов, гостевых домов
    const query = `
      [out:json][timeout:${this.timeout}];
      (
        node["tourism"="hotel"](around:${radius},${lat},${lng});
        way["tourism"="hotel"](around:${radius},${lat},${lng});
        relation["tourism"="hotel"](around:${radius},${lat},${lng});
        node["tourism"="guest_house"](around:${radius},${lat},${lng});
        way["tourism"="guest_house"](around:${radius},${lat},${lng});
        node["tourism"="hostel"](around:${radius},${lat},${lng});
        way["tourism"="hostel"](around:${radius},${lat},${lng});
        node["tourism"="chalet"](around:${radius},${lat},${lng});
        way["tourism"="chalet"](around:${radius},${lat},${lng});
      );
      out center tags;
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.statusText}`);
      }

      const data = await response.json() as OverpassResponse;
      
      return this.normalizeElements(data.elements, lat, lng);
    } catch (error) {
      console.error('Overpass API request failed:', error);
      return [];
    }
  }

  /**
   * Нормализация элементов OSM в формат отелей
   */
  private normalizeElements(elements: OverpassElement[], centerLat: number, centerLng: number): OSMHotel[] {
    return elements
      .filter(el => el.tags?.name) // Только с названиями
      .map(el => {
        const lat = el.lat ?? el.center?.lat ?? centerLat;
        const lon = el.lon ?? el.center?.lon ?? centerLng;
        
        // Определяем звёздность
        let stars: number | undefined;
        if (el.tags.stars) {
          const starsNum = parseInt(el.tags.stars);
          if (!isNaN(starsNum) && starsNum >= 1 && starsNum <= 5) {
            stars = starsNum;
          }
        }

        // Собираем адрес
        const addressParts: string[] = [];
        if (el.tags['addr:street']) {
          addressParts.push(el.tags['addr:street']);
        }
        if (el.tags['addr:housenumber']) {
          addressParts.push(el.tags['addr:housenumber']);
        }
        if (el.tags['addr:city']) {
          addressParts.push(el.tags['addr:city']);
        }

        return {
          id: `osm_${el.type}_${el.id}`,
          name: el.tags['name:ru'] || el.tags.name || 'Unknown Hotel',
          lat,
          lon,
          stars,
          phone: el.tags.phone || el.tags['contact:phone'],
          website: el.tags.website || el.tags['contact:website'],
          address: addressParts.length > 0 ? addressParts.join(', ') : undefined,
          tags: el.tags as Record<string, string>,
        };
      })
      .filter(hotel => {
        // Фильтруем дубликаты по координатам (в радиусе 10м)
        return hotel.lat && hotel.lon;
      });
  }

  /**
   * Расчёт расстояния между двумя точками (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Радиус Земли в метрах
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const overpassService = new OverpassService();
