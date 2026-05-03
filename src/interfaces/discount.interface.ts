export interface DiscountCodeInterface {
    id: number;
    code: string;
    discount_percentage: string | number;
    max_installments: number;
    valid_until?: string;
    is_active: boolean;
    user_id?: number | null;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    created_at: string;
    updated_at: string;
}
