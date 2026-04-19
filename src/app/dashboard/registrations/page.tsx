import { RegistrationInterface } from '@/interfaces/registration.interface';
import { cookies } from 'next/headers';
import React from 'react';

export default async function RegistrationsPage() {
    const cookiesResolved = await cookies();
    const token = cookiesResolved.get('auth_token')?.value;

    const res = await fetch(`${process.env.API_URL}/registrations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });
    
    let registrations: RegistrationInterface[] = [];
    try {
        const data = await res.json();
        if (Array.isArray(data)) registrations = data;
        else if (Array.isArray(data?.data)) registrations = data.data;
        else if (Array.isArray(data?.registrations)) registrations = data.registrations;
    } catch (e) {
        console.error("Error parsing registrations API response", e);
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-secondary mb-6">Registros</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deportista</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campamento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición / Nivel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuotas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(registrations) && registrations.map((reg) => (
                            <tr key={reg.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{reg.user?.name} {reg.user?.last_name}</div>
                                    <div className="text-sm text-gray-500">{reg.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {reg.camp?.name || `Camp ID: ${reg.camp_id}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {reg.position} / {reg.skill_level}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.payment_status === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {reg.payment_status || 'Pendiente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {reg.installments_count}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button className="text-secondary hover:text-primary transition-colors">Ver Detalle</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!registrations || registrations.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        No hay registros disponibles.
                    </div>
                )}
            </div>
        </div>
    );
}
