export interface UserInterface {
  id: number;
  name: string;
  last_name: string;
  birth_date: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  birth_country_id?: number | string | null;
  city_id?: number | string | null;
  sport: string;
  phone: string;
  gender: "M" | "F" | string;
  graduation_year: number;
  role: string;
  city?: {
    id: number;
    name: string;
  } | null;
  birth_country?: {
    id: number;
    name: string;
  } | null;
  birthCountry?: {
    id: number;
    name: string;
  } | null;
}