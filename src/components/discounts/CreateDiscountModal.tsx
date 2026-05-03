"use client";

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface CreateDiscountModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateDiscountModal({ onClose, onCreated }: CreateDiscountModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        discount_percentage: '',
        max_installments: '1',
        valid_until: '',
        is_active: true,
        user_id: ''
    });

    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                console.log(data);
                if (data.success) {
                    setUsers(data.data.filter((u: any) => u.role === 'user'));
                }
            } catch (error) {
                console.error("Error fetching users", error);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const bodyData: any = {
                ...formData,
                discount_percentage: Number(formData.discount_percentage),
                max_installments: Number(formData.max_installments),
                valid_until: formData.valid_until || null
            };

            if (formData.user_id) {
                bodyData.user_id = Number(formData.user_id);
            }

            const res = await fetch('/api/discount-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al crear el código de descuento');
            }

            onCreated();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-secondary w-full max-w-md rounded-2xl shadow-2xl border border-secondary-light overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-secondary-light flex justify-between items-center bg-secondary-light/30">
                    <h2 className="text-xl font-bold text-white">Nuevo Código de Descuento</h2>
                    <button onClick={onClose} className="text-muted hover:text-white transition-colors">
                        <IoClose size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1 ml-1">Código *</label>
                        <input
                            required
                            type="text"
                            placeholder="EJ: VERANO2024"
                            className="w-full bg-[#fbffd4] text-secondary border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/40"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1 ml-1">Asignar a Estudiante (Opcional)</label>
                        <select
                            className="w-full bg-[#fbffd4] text-secondary border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary transition-all"
                            value={formData.user_id}
                            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                        >
                            <option value="">Para cualquier estudiante (Público)</option>
                            {!loadingUsers && users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1 ml-1">Descuento (%) *</label>
                            <input
                                required
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
                                className="w-full bg-[#fbffd4] text-secondary border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary transition-all placeholder:text-secondary/40"
                                value={formData.discount_percentage}
                                onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1 ml-1">Máx. Cuotas *</label>
                            <input
                                required
                                type="number"
                                min="1"
                                className="w-full bg-[#fbffd4] text-secondary border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary transition-all"
                                value={formData.max_installments}
                                onChange={(e) => setFormData({ ...formData, max_installments: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1 ml-1">Válido Hasta (Opcional)</label>
                        <input
                            type="date"
                            className="w-full bg-[#fbffd4] text-secondary border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary transition-all"
                            value={formData.valid_until}
                            onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="w-5 h-5 rounded-md accent-primary"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <label htmlFor="is_active" className="text-white font-semibold">Código Activo</label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-secondary-light text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-secondary font-black py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(175,255,0,0.3)]"
                        >
                            {loading ? 'Guardando...' : 'Crear Código'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
