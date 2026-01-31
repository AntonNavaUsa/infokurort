import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Hotel, Coordinates } from '@/types/accommodation';
import { ExternalLink, Star, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix для иконок Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapWidgetProps {
  center: Coordinates;
  zoom?: number;
  hotels: Hotel[];
  onHotelClick?: (hotel: Hotel) => void;
}

export function MapWidget({ center, zoom = 13, hotels, onHotelClick }: MapWidgetProps) {
  const [mounted, setMounted] = useState(false);

  // Leaflet needs to be mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка карты...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.coordinates.lat, hotel.coordinates.lng]}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <HotelPopup hotel={hotel} onBookClick={onHotelClick} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

interface HotelPopupProps {
  hotel: Hotel;
  onBookClick?: (hotel: Hotel) => void;
}

function HotelPopup({ hotel, onBookClick }: HotelPopupProps) {
  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick(hotel);
    } else {
      window.open(hotel.deeplinkUrl, '_blank');
    }
  };

  return (
    <Card className="border-0 shadow-none p-2">
      <div className="space-y-2">
        {/* Image */}
        {hotel.imageUrl && (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-32 object-cover rounded-md"
            loading="lazy"
          />
        )}

        {/* Hotel Name */}
        <h3 className="font-semibold text-sm line-clamp-2">{hotel.name}</h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-medium">{hotel.rating.toFixed(1)}</span>
          </div>
          {hotel.reviewCount > 0 && (
            <span className="text-muted-foreground">
              ({hotel.reviewCount} отзывов)
            </span>
          )}
          {hotel.stars && (
            <span className="ml-auto text-muted-foreground">
              {hotel.stars}★
            </span>
          )}
        </div>

        {/* Distance */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{(hotel.distance / 1000).toFixed(1)} км от центра</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {hotel.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {hotel.originalPrice} {hotel.currency}
            </span>
          )}
          <span className="text-lg font-bold text-primary">
            {hotel.price} {hotel.currency}
          </span>
          <span className="text-xs text-muted-foreground">/ ночь</span>
        </div>

        {/* Book Button */}
        <Button
          onClick={handleBookClick}
          className="w-full"
          size="sm"
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          Забронировать на {hotel.ota}
        </Button>

        {/* OTA Badge */}
        <div className="text-xs text-center text-muted-foreground">
          через {hotel.ota.charAt(0).toUpperCase() + hotel.ota.slice(1)}
        </div>
      </div>
    </Card>
  );
}
