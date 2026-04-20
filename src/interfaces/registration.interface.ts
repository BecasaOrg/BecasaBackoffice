import { UserInterface } from './user.interface';
import { CampInterface } from './camp.interface';

export interface RegistrationInterface {
    id: number;
    user_id: number;
    camp_id: number;
    position: string;
    years_experience: number;
    skill_level: string;
    shirt_size: string;
    club_name?: string;
    health_insurance_path?: string;
    dietary_restrictions?: string;
    medical_conditions?: string;
    guardian_name: string;
    guardian_phone: string;
    guardian_email: string;
    identification_type: string;
    identification_number: string;
    school_name: string;
    payment_status: string;
    total_price: number;
    installments_count: number;
    discount_code_id?: number;
    user?: UserInterface;
    camp?: CampInterface;
    created_at: string;
    updated_at: string;
}
