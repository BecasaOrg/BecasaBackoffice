"use client";

import { RegistrationInterface } from '@/interfaces/registration.interface';
import React, { useEffect, useState, useCallback } from 'react';
import { FaClipboardList, FaUser, FaUmbrellaBeach, FaCreditCard, FaChevronRight } from 'react-icons/fa';

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<RegistrationInterface[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRegistrations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/registrations');
            const data = await res.json();
            
            // Robust parsing for various API responses
            if (Array.isArray(data)) {
                setRegistrations(data);
            } else if (Array.isArray(data?.data)) {
                setRegistrations(data.data);
            } else if (Array.isArray(data?.registrations)) {
                setRegistrations(data.registrations);
            } else {
                setRegistrations([]);
            }
        } catch (error) {
            console.error("Error fetching registrations:", error);
            setRegistrations([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-secondary/40 backdrop-blur-md p-6 rounded-3xl border border-secondary-light shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                        <FaClipboardList size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Registros</h1>
                        <p className="text-muted text-sm font-medium">Gestiona los deportistas inscritos en los campamentos</p>
                    </div>
                </div>
            </div>

            <div className="bg-secondary/40 backdrop-blur-md rounded-3xl border border-secondary-light shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-secondary-light">
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Deportista</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Campamento</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Posición / Nivel</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Estado Pago</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-light/30">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-16 bg-secondary-light/10"></td>
                                    </tr>
                                ))
                            ) : registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <FaClipboardList size={48} className="text-muted" />
                                            <p className="text-xl font-bold text-muted">No hay registros disponibles</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-secondary-light rounded-full flex items-center justify-center text-primary/60 border border-secondary-light">
                                                    <FaUser size={14} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-base leading-tight">
                                                        {reg.user?.name} {reg.user?.last_name}
                                                    </div>
                                                    <div className="text-muted text-xs font-medium">{reg.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-white font-semibold">
                                                <FaUmbrellaBeach className="text-primary/40" />
                                                <span>{reg.camp?.name || `Camp ID: ${reg.camp_id}`}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-bold text-muted bg-secondary-light/50 px-3 py-1 rounded-lg">
                                                {reg.position} • {reg.skill_level}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                reg.payment_status === 'pagado' || reg.payment_status === 'paid'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                                <FaCreditCard />
                                                {reg.payment_status?.toUpperCase() || 'PENDIENTE'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 bg-secondary-light rounded-xl text-primary hover:bg-primary hover:text-secondary hover:scale-110 transition-all">
                                                <FaChevronRight />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
