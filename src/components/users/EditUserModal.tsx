"use client";

import { UserInterface } from '@/interfaces/user.interface';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface Props {
    user: UserInterface;
    onClose: () => void;
    onUpdated: () => void;
}

const inputClass = "w-full bg-secondary-light text-white placeholder:text-muted border border-secondary-light rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary";
const selectClass = "w-full bg-secondary-light text-white border border-secondary-light rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary";
const labelClass = "block text-xs text-muted uppercase tracking-wide mb-1";

export default function EditUserModal({ user, onClose, onUpdated }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        birth_date: user.birth_date ? user.birth_date.split('T')[0] : '',
        gender: user.gender || '',
        sport: user.sport || '',
        graduation_year: user.graduation_year?.toString() || '',
    });

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.errors) {
                    const msgs = Object.values(data.errors as Record<string, string[]>).flat().join(' | ');
                    throw new Error(msgs);
                }
                throw new Error(data.message || 'Error al actualizar usuario');
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
            <div className="bg-secondary rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-secondary-light px-6 py-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-primary font-bold text-xl">Editar Estudiante</h2>
                    <button onClick={onClose} className="text-muted hover:text-white transition-colors cursor-pointer"><FaTimes size={20} /></button>
                </div>

                <form onSubmit={submit} className="px-6 py-4 space-y-4">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>
                    )}

                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nombre *</label>
                            <input name="name" required value={form.name} onChange={handle} className={inputClass} placeholder="Nombre" />
                        </div>
                        <div>
                            <label className={labelClass}>Apellido *</label>
                            <input name="last_name" required value={form.last_name} onChange={handle} className={inputClass} placeholder="Apellido" />
                        </div>
                    </div>

                    {/* Email y Teléfono */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Correo electrónico *</label>
                            <input name="email" type="email" required value={form.email} onChange={handle} className={inputClass} placeholder="correo@ejemplo.com" />
                        </div>
                        <div>
                            <label className={labelClass}>Teléfono</label>
                            <input name="phone" value={form.phone} onChange={handle} className={inputClass} placeholder="+57 300 123 4567" />
                        </div>
                    </div>

                    {/* Fecha de nacimiento y Género */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Fecha de nacimiento</label>
                            <input type="date" name="birth_date" value={form.birth_date} onChange={handle} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Género</label>
                            <select name="gender" value={form.gender} onChange={handle} className={selectClass}>
                                <option value="">Seleccionar</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                    </div>

                    {/* Deporte y Año de graduación */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Deporte</label>
                            <input name="sport" value={form.sport} onChange={handle} className={inputClass} placeholder="Ej: Fútbol" />
                        </div>
                        <div>
                            <label className={labelClass}>Año de graduación</label>
                            <input type="number" name="graduation_year" min="1900" max="2100" value={form.graduation_year} onChange={handle} className={inputClass} placeholder="Ej: 2026" />
                        </div>
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
