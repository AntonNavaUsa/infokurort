import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterValues {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy: 'distance' | 'price-asc' | 'price-desc' | 'rating';
}

interface FilterPanelProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  priceRange?: { min: number; max: number };
}

export function FilterPanel({
  filters,
  onFiltersChange,
  priceRange = { min: 0, max: 10000 },
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const handlePriceChange = (value: number[]) => {
    const newFilters = {
      ...localFilters,
      minPrice: value[0],
      maxPrice: value[1],
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (value: string) => {
    const rating = value === 'all' ? undefined : parseFloat(value);
    const newFilters = {
      ...localFilters,
      minRating: rating,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      sortBy: value as FilterValues['sortBy'],
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      sortBy: 'distance',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = localFilters.minPrice || localFilters.maxPrice || localFilters.minRating;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base">Фильтры и сортировка</CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Сбросить
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort */}
        <div className="space-y-2">
          <Label>Сортировка</Label>
          <Select value={localFilters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите сортировку" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">По расстоянию</SelectItem>
              <SelectItem value="price-asc">По цене ↑</SelectItem>
              <SelectItem value="price-desc">По цене ↓</SelectItem>
              <SelectItem value="rating">По рейтингу</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Цена за ночь</Label>
            <span className="text-sm text-muted-foreground">
              {localFilters.minPrice || priceRange.min} -{' '}
              {localFilters.maxPrice || priceRange.max} ₽
            </span>
          </div>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={100}
            value={[
              localFilters.minPrice || priceRange.min,
              localFilters.maxPrice || priceRange.max,
            ]}
            onValueChange={handlePriceChange}
            className="w-full"
          />
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Минимальный рейтинг</Label>
          <Select
            value={localFilters.minRating?.toString() || 'all'}
            onValueChange={handleRatingChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Все рейтинги" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все рейтинги</SelectItem>
              <SelectItem value="7">7+ ⭐</SelectItem>
              <SelectItem value="8">8+ ⭐⭐</SelectItem>
              <SelectItem value="9">9+ ⭐⭐⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
