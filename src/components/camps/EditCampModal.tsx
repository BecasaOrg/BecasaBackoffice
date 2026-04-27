"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { CampInterface } from '@/interfaces/camp.interface';

interface City {
    id: number;
    name: string;
    state?: { name: string };
}

interface Props {
    camp: CampInterface;
    onClose: () => void;
    onUpdated: () => void;
}

const inputClass = "w-full bg-secondary-light text-white placeholder:text-muted border border-secondary-light rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary";
const selectClass = "w-full bg-secondary-light text-white border border-secondary-light rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary";
const labelClass = "block text-xs text-muted uppercase tracking-wide mb-1";

export default function EditCampModal({ camp, onClose, onUpdated }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(true);

    const [form, setForm] = useState({
        name: camp.name || '',
        description: camp.description || '',
        start_date: camp.start_date ? camp.start_date.split('T')[0] : '',
        end_date: camp.end_date ? camp.end_date.split('T')[0] : '',
        price: camp.price?.toString() || '',
        capacity: camp.capacity?.toString() || '',
        min_age: (camp as any).min_age?.toString() || '',
        max_age: (camp as any).max_age?.toString() || '',
        sport_type: (camp as any).sport_type || camp.sport || '',
        city_id: camp.city_id?.toString() || '',
        address: (camp as any).address || camp.location || '',
    });

    // Cargar ciudades al abrir el modal
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch('https://athleticscholarshipagency.com/api/cities');
                const data = await res.json();
                setCities(data.data || data || []);
            } catch {
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
    }, []);

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/camps/${camp.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    capacity: parseInt(form.capacity),
                    min_age: parseInt(form.min_age),
                    max_age: parseInt(form.max_age),
                    city_id: parseInt(form.city_id),
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.errors) {
                    const msgs = Object.values(data.errors as Record<string, string[]>).flat().join(' | ');
                    throw new Error(msgs);
                }
                throw new Error(data.message || 'Error al actualizar campamento');
            }
            onUpdated();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-secondary rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-secondary-light px-6 py-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-primary font-bold text-xl">Editar Campamento</h2>
                    <button onClick={onClose} className="text-muted hover:text-white transition-colors cursor-pointer"><FaTimes size={20} /></button>
                </div>

                <form onSubmit={submit} className="px-6 py-4 space-y-4">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className={labelClass}>Nombre *</label>
                        <input name="name" required value={form.name} onChange={handle} className={inputClass} placeholder="Ej: Campamento de Fútbol 2026" />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className={labelClass}>Descripción</label>
                        <textarea name="description" value={form.description} onChange={handle} rows={3} className={inputClass} placeholder="Descripción del campamento..." />
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Fecha de inicio *</label>
                            <input type="date" name="start_date" required value={form.start_date} onChange={handle} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Fecha de fin *</label>
                            <input type="date" name="end_date" required value={form.end_date} onChange={handle} className={inputClass} />
                        </div>
                    </div>

                    {/* Precio y Capacidad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Precio (COP) *</label>
                            <input type="number" name="price" required min="0" value={form.price} onChange={handle} className={inputClass} placeholder="Ej: 500000" />
                        </div>
                        <div>
                            <label className={labelClass}>Capacidad *</label>
                            <input type="number" name="capacity" required min="1" value={form.capacity} onChange={handle} className={inputClass} placeholder="Ej: 30" />
                        </div>
                    </div>

                    {/* Edades */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Edad mínima *</label>
                            <input type="number" name="min_age" required min="1" value={form.min_age} onChange={handle} className={inputClass} placeholder="Ej: 8" />
                        </div>
                        <div>
                            <label className={labelClass}>Edad máxima *</label>
                            <input type="number" name="max_age" required min="1" value={form.max_age} onChange={handle} className={inputClass} placeholder="Ej: 18" />
                        </div>
                    </div>

                    {/* Deporte y Ciudad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Tipo de deporte *</label>
                            <input name="sport_type" required value={form.sport_type} onChange={handle} className={inputClass} placeholder="Ej: Fútbol" />
                        </div>
                        <div>
                            <label className={labelClass}>Ciudad *</label>
                            {loadingCities ? (
                                <div className={`${inputClass} text-muted`}>Cargando ciudades...</div>
                            ) : (
                                <select
                                    name="city_id"
                                    required
                                    value={form.city_id}
                                    onChange={handle}
                                    className={selectClass}
                                >
                                    <option value="">Selecciona una ciudad</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}{city.state ? ` — ${city.state.name}` : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className={labelClass}>Dirección</label>
                        <input name="address" value={form.address} onChange={handle} className={inputClass} placeholder="Ej: Calle 123 # 45-67" />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 pb-2">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-muted text-muted hover:text-white hover:border-white transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="bg-primary text-secondary font-bold px-6 py-2 rounded-lg hover:scale-105 transition-transform cursor-pointer disabled:opacity-50">
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
