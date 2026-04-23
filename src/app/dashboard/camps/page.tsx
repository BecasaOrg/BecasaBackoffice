"use client";

import { CampInterface } from '@/interfaces/camp.interface';
import CreateCampModal from '@/components/camps/CreateCampModal';
import EditCampModal from '@/components/camps/EditCampModal';
import React, { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaSearchLocation, FaRunning, FaEdit } from 'react-icons/fa';

export default function CampsPage() {
    const [camps, setCamps] = useState<CampInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [campToEdit, setCampToEdit] = useState<CampInterface | null>(null);

    const fetchCamps = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/camps');
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setCamps(data);
            } else if (Array.isArray(data?.data)) {
                setCamps(data.data);
            } else if (Array.isArray(data?.camps)) {
                setCamps(data.camps);
            } else {
                setCamps([]);
            }
        } catch (error) {
            console.error("Error fetching camps:", error);
            setCamps([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCamps();
    }, [fetchCamps]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('es-CO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Pro */}
            <div className="flex justify-between items-center bg-secondary/40 backdrop-blur-md p-6 rounded-3xl border border-secondary-light shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                        <FaSearchLocation size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Campamentos</h1>
                        <p className="text-muted text-sm font-medium">Gestiona las sedes y eventos deportivos</p>
                    </div>
                </div>
                
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-secondary font-black px-6 py-3 rounded-2xl shadow-[0_4px_15px_rgba(175,255,0,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                    <FaPlus size={14} />
                    <span>Crear Campamento</span>
                </button>
            </div>

            {/* List View Pro */}
            <div className="bg-secondary/40 backdrop-blur-md rounded-3xl border border-secondary-light shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-secondary-light">
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Información General</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Deporte</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Fechas</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Precio</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-right">Cupos / Edad</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-light/30">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-8 h-20 bg-secondary-light/10"></td>
                                    </tr>
                                ))
                            ) : camps.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <FaSearchLocation size={48} className="text-muted" />
                                            <p className="text-xl font-bold text-muted">No hay campamentos registrados</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                camps.map((camp) => (
                                    <tr key={camp.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-white text-lg group-hover:text-primary transition-colors">
                                                {camp.name}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-muted text-xs font-semibold mt-1">
                                                <FaSearchLocation className="text-primary/40" />
                                                {(camp as any).city?.name ? `${(camp as any).city.name} - ` : ''}
                                                {camp.address || camp.location || 'Sede no especificada'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center gap-2 bg-secondary-light px-3 py-1 rounded-lg text-primary text-xs font-black uppercase tracking-tight">
                                                <FaRunning />
                                                {(camp as any).sport_type ?? camp.sport ?? 'General'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="text-white font-bold text-sm">{formatDate(camp.start_date)}</div>
                                                <div className="text-muted text-[10px] uppercase font-black tracking-widest mt-1">Hasta {formatDate(camp.end_date)}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-block bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
                                                <span className="text-primary font-black text-lg">
                                                    ${Number(camp.price).toLocaleString('es-CO')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="text-white font-bold">{camp.capacity} Cupos</div>
                                            <div className="text-muted text-xs">{(camp as any).min_age || '8'} - {(camp as any).max_age || '17'} años</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={() => setCampToEdit(camp)}
                                                    className="w-10 h-10 bg-secondary-light/50 rounded-xl flex items-center justify-center text-primary border border-secondary-light hover:bg-primary hover:text-secondary transition-all"
                                                    title="Editar campamento"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <CreateCampModal
                    token=""
                    onClose={() => setShowModal(false)}
                    onCreated={fetchCamps}
                />
            )}
            
            {campToEdit && (
                <EditCampModal
                    camp={campToEdit}
                    onClose={() => setCampToEdit(null)}
                    onUpdated={fetchCamps}
                />
            )}
        </div>
    );
}
