export interface UserInterface {
  id: number;
  name: string;
  last_name: string;
  birth_date: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  birth_country: string;
  city_id: string;
  sport: string;
  phone: string;
  gender: "M" | "F" | string;
  graduation_year: number;
  role: string;
}