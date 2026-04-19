"use client";

import { CampInterface } from '@/interfaces/camp.interface';
import CreateCampModal from '@/components/camps/CreateCampModal';
import React, { useEffect, useState } from 'react';

export default function CampsPage() {
    const [camps, setCamps] = useState<CampInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchCamps = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/camps');
            const data = await res.json();
            // Manejar cualquier estructura de respuesta
            if (Array.isArray(data)) {
                setCamps(data);
            } else if (Array.isArray(data?.data)) {
                setCamps(data.data);
            } else if (Array.isArray(data?.camps)) {
                setCamps(data.camps);
            } else {
                setCamps([]);
            }
        } catch {
            setCamps([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCamps();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-secondary">Campamentos</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-secondary font-bold px-4 py-2 rounded shadow hover:scale-105 transition-transform cursor-pointer"
                >
                    Crear Campamento
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deporte</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edades</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">Cargando campamentos...</td>
                            </tr>
                        ) : camps.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No hay campamentos registrados.</td>
                            </tr>
                        ) : (
                            camps.map((camp) => (
                                <tr key={camp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{camp.name}</div>
                                        {camp.location && <div className="text-xs text-gray-500">{camp.location}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{(camp as unknown as Record<string, string>).sport_type ?? '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                        {camp.start_date} → {camp.end_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        ${Number(camp.price).toLocaleString('es-CO')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{camp.capacity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {(camp as unknown as Record<string, number>).min_age ?? '?'} - {(camp as unknown as Record<string, number>).max_age ?? '?'} años
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <CreateCampModal
                    token=""
                    onClose={() => setShowModal(false)}
                    onCreated={fetchCamps}
                />
            )}
        </div>
    );
}
