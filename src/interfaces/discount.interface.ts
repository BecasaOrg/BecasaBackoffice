export interface DiscountCodeInterface {
    id: number;
    code: string;
    discount_percentage: string | number;
    max_installments: number;
    valid_until?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
