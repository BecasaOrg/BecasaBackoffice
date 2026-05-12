"use client";

import { RegistrationInterface } from '@/interfaces/registration.interface';
import React, { useEffect, useState, useCallback } from 'react';
import { FaClipboardList, FaUser, FaUmbrellaBeach, FaCreditCard, FaChevronRight, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import RegistrationDetailModal from '@/components/registrations/RegistrationDetailModal';

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<RegistrationInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationInterface | null>(null);

    const fetchRegistrations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/registrations');
            const data = await res.json();

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

    const exportToExcel = () => {
        if (registrations.length === 0) return;

        const dataToExport = registrations.map(reg => ({
            'Nombre del Estudiante': `${reg.user?.name || ''} ${reg.user?.last_name || ''}`.trim(),
            'Email Estudiante': reg.user?.email || '',
            'Campamento': reg.camp?.name || `ID: ${reg.camp_id}`,
            'Precio Total': reg.total_price || 0,
            'Estado de Pago': reg.payment_status === 'paid' || reg.payment_status === 'pagado' ? 'Pagado' : 'Pendiente',
            'Cuotas': reg.installments_count || 1,
            'Posición': reg.position || '',
            'Nivel': reg.skill_level || '',
            'Talla de Camiseta': reg.shirt_size || '',
            'Club': reg.club_name || 'N/A',
            'Años de Experiencia': reg.years_experience || 0,
            'Identificación': `${reg.identification_type} ${reg.identification_number}`,
            'Colegio': reg.school_name || 'N/A',
            'Tutor/Acudiente': reg.guardian_name || '',
            'Teléfono Tutor': reg.guardian_phone || '',
            'Email Tutor': reg.guardian_email || '',
            'Condiciones Médicas': reg.medical_conditions || 'Ninguna',
            'Restricciones Dietéticas': reg.dietary_restrictions || 'Ninguna',
            'Fecha de Registro': reg.created_at ? new Date(reg.created_at).toLocaleString() : ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inscripciones");
        XLSX.writeFile(workbook, "Inscripciones_Becasa.xlsx");
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-secondary/40 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-secondary-light shadow-xl gap-3 sm:gap-0">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl md:rounded-2xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <FaClipboardList size={16} className="md:w-5 md:h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Registros</h1>
                        <p className="text-muted text-xs md:text-sm font-medium">Gestiona los deportistas inscritos en los campamentos</p>
                    </div>
                </div>
                
                <button 
                    onClick={exportToExcel}
                    disabled={loading || registrations.length === 0}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center shadow-lg shadow-green-900/20"
                >
                    <FaFileExcel size={16} />
                    Exportar a Excel
                </button>
            </div>

            {/* Mobile: Card layout */}
            <div className="block md:hidden space-y-3">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-secondary/40 backdrop-blur-md rounded-2xl border border-secondary-light shadow-xl p-4 animate-pulse">
                            <div className="h-16 bg-secondary-light/10 rounded-xl"></div>
                        </div>
                    ))
                ) : registrations.length === 0 ? (
                    <div className="bg-secondary/40 backdrop-blur-md rounded-2xl border border-secondary-light shadow-xl p-10 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                            <FaClipboardList size={40} className="text-muted" />
                            <p className="text-lg font-bold text-muted">No hay registros disponibles</p>
                        </div>
                    </div>
                ) : (
                    registrations.map((reg) => (
                        <div key={reg.id} className="bg-secondary/40 backdrop-blur-md rounded-2xl border border-secondary-light shadow-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 bg-secondary-light rounded-full flex items-center justify-center text-primary/60 border border-secondary-light shrink-0">
                                        <FaUser size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-white text-sm leading-tight truncate">
                                            {reg.user?.name} {reg.user?.last_name}
                                        </div>
                                        <div className="text-muted text-xs font-medium truncate">{reg.user?.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRegistration(reg)}
                                    className="p-2 bg-secondary-light rounded-xl text-primary hover:bg-primary hover:text-secondary hover:scale-110 transition-all shrink-0 ml-2"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                                <FaUmbrellaBeach className="text-primary/40 shrink-0" />
                                <span className="truncate">{reg.camp?.name || `Camp ID: ${reg.camp_id}`}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-muted bg-secondary-light/50 px-3 py-1 rounded-lg whitespace-nowrap">
                                    {reg.position} • {reg.skill_level}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${reg.payment_status == 'pagado' || reg.payment_status === 'paid'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                    }`}>
                                    <FaCreditCard size={10} />
                                    {reg.payment_status == 'paid' ? 'Pagado' : 'Pendiente'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block bg-secondary/40 backdrop-blur-md rounded-3xl border border-secondary-light shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-secondary-light">
                                <th className="px-6 lg:px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Deportista</th>
                                <th className="px-6 lg:px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Campamento</th>
                                <th className="px-6 lg:px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Posición / Nivel</th>
                                <th className="px-6 lg:px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Estado Pago</th>
                                <th className="px-6 lg:px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-light/30">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 lg:px-8 py-6 h-16 bg-secondary-light/10"></td>
                                    </tr>
                                ))
                            ) : registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 lg:px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <FaClipboardList size={48} className="text-muted" />
                                            <p className="text-xl font-bold text-muted">No hay registros disponibles</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 lg:px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-secondary-light rounded-full flex items-center justify-center text-primary/60 border border-secondary-light shrink-0">
                                                    <FaUser size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-white text-sm lg:text-base leading-tight truncate">
                                                        {reg.user?.name} {reg.user?.last_name}
                                                    </div>
                                                    <div className="text-muted text-xs font-medium truncate">{reg.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-6">
                                            <div className="flex items-center gap-2 text-white font-semibold">
                                                <FaUmbrellaBeach className="text-primary/40 shrink-0" />
                                                <span className="truncate max-w-[150px] lg:max-w-none">{reg.camp?.name || `Camp ID: ${reg.camp_id}`}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-6 text-center">
                                            <span className="text-xs lg:text-sm font-bold text-muted bg-secondary-light/50 px-2 lg:px-3 py-1 rounded-lg">
                                                {reg.position} • {reg.skill_level}
                                            </span>
                                        </td>
                                        <td className="px-6 lg:px-8 py-6 text-center">
                                            <span className={`inline-flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${reg.payment_status == 'pagado' || reg.payment_status === 'paid'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                <FaCreditCard size={10} />
                                                {reg.payment_status == 'paid' ? 'Pagado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 lg:px-8 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedRegistration(reg)}
                                                className="p-2 bg-secondary-light rounded-xl text-primary hover:bg-primary hover:text-secondary hover:scale-110 transition-all"
                                            >
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

            {selectedRegistration && (
                <RegistrationDetailModal
                    registration={selectedRegistration}
                    onClose={() => setSelectedRegistration(null)}
                />
            )}
        </div>
    );
}
