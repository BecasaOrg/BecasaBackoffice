export interface CampInterface {
    id: number;
    name: string;
    description?: string;
    location?: string;
    address?: string;
    schedule?: string;
    sport_type?: string;
    start_date: string;
    end_date: string;
    registration_start_date?: string;
    registration_end_date?: string;
    price: string | number;
    extraordinary_price?: string | number;
    normal_price_text?: string;
    extraordinary_price_text?: string;
    available_spots?: number;

    capacity: number;
    min_age?: number;
    max_age?: number;
    is_active?: boolean;
    city_id?: number;
    created_at: string;
    updated_at: string;
    sport?: string;
    city?: { id: number; name: string };
}
