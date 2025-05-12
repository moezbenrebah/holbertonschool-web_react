import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface StayInfo {
  stay_info_id: number;
  accommodation_id: number;
  title: string;
  description: string | null;
  category: string | null;
  photo_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AccommodationInfo {
  accommodation_id: number;
  uuid: string;
  users_id: string;
  name: string;
  type: string;
  photo_url?: string | null;
  description?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  zipcode: string;
  country: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  stayInfo?: StayInfo[];
}

interface ShopSelectorProps {
  accommodations: AccommodationInfo[] | null;
  selectedAccommodationId: number | null;
  onSelect: (accommodationId: number) => void;
}

export function ShopSelector({ accommodations, selectedAccommodationId, onSelect }: ShopSelectorProps) {
  if (!accommodations || accommodations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Aucun hébergement disponible
      </div>
    )
  }

  return (
    <Select
      value={selectedAccommodationId?.toString()}
      onValueChange={(value) => onSelect(parseInt(value))}
    >
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Sélectionnez un hébergement" />
      </SelectTrigger>
      <SelectContent>
        {accommodations.map((accommodation) => (
          <SelectItem
            key={accommodation.accommodation_id}
            value={accommodation.accommodation_id.toString()}
          >
            {accommodation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
