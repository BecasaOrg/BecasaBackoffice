import { DiscountCodeInterface } from '@/interfaces/discount.interface';
import { cookies } from 'next/headers';
import React from 'react';

export default async function DiscountsPage() {
    const cookiesResolved = await cookies();
    const token = cookiesResolved.get('auth_token')?.value;

    const res = await fetch(`${process.env.API_URL}/discount-codes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });
    
    let discounts: DiscountCodeInterface[] = [];
    try {
        const data = await res.json();
        if (Array.isArray(data)) discounts = data;
        else if (Array.isArray(data?.data)) discounts = data.data;
        else if (Array.isArray(data?.discount_codes)) discounts = data.discount_codes;
    } catch (e) {
        console.error("Error parsing discounts API response", e);
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-secondary">Códigos de Descuento</h1>
                <button className="bg-primary text-secondary font-bold px-4 py-2 rounded shadow hover:scale-105 transition-transform">
                    Nuevo Descuento
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento (%)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máx. Cuotas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Válido Hasta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(discounts) && discounts.map((discount) => (
                            <tr key={discount.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{discount.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{discount.discount_percentage}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{discount.max_installments}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {discount.valid_until ? new Date(discount.valid_until).toLocaleDateString() : 'Sin Límite'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${discount.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {discount.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!discounts || discounts.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        No hay códigos de descuento registrados.
                    </div>
                )}
            </div>
        </div>
    );
}
