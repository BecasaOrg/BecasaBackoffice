"use client";

import { DiscountCodeInterface } from '@/interfaces/discount.interface';
import CreateDiscountModal from '@/components/discounts/CreateDiscountModal';
import React, { useEffect, useState, useCallback } from 'react';
import { FaTag, FaPlus, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';

export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState<DiscountCodeInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchDiscounts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/discount-codes');
            const data = await res.json();
            
            // Robust parsing for various API responses
            if (Array.isArray(data)) {
                setDiscounts(data);
            } else if (Array.isArray(data?.data)) {
                setDiscounts(data.data);
            } else if (Array.isArray(data?.discount_codes)) {
                setDiscounts(data.discount_codes);
            } else {
                setDiscounts([]);
            }
        } catch (error) {
            console.error("Error fetching discounts:", error);
            setDiscounts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDiscounts();
    }, [fetchDiscounts]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-secondary/40 backdrop-blur-md p-6 rounded-3xl border border-secondary-light shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                        <FaTag size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Códigos de Descuento</h1>
                        <p className="text-muted text-sm font-medium">Administra las promociones y beneficios</p>
                    </div>
                </div>
                
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-secondary font-black px-6 py-3 rounded-2xl shadow-[0_4px_15px_rgba(175,255,0,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                    <FaPlus size={14} />
                    <span>Nuevo Descuento</span>
                </button>
            </div>

            <div className="bg-secondary/40 backdrop-blur-md rounded-3xl border border-secondary-light shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-secondary-light">
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Código</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Descuento</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Máx. Cuotas</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Vencimiento</th>
                                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-light/30">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-16 bg-secondary-light/10"></td>
                                    </tr>
                                ))
                            ) : discounts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <FaTag size={48} className="text-muted" />
                                            <p className="text-xl font-bold text-muted">No hay códigos registrados</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                discounts.map((discount) => (
                                    <tr key={discount.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <span className="font-black text-white text-lg tracking-wider bg-secondary-light px-3 py-1 rounded-lg w-max group-hover:bg-primary/20 group-hover:text-primary transition-all">
                                                    {discount.code}
                                                </span>
                                                {discount.user ? (
                                                    <span className="text-xs text-muted font-medium bg-secondary-light/50 px-2 py-1 rounded w-max">
                                                        👤 {discount.user.first_name} {discount.user.last_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted/50 font-medium px-2 py-1">
                                                        🌐 Público
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-2xl font-black text-white">{discount.discount_percentage}%</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-xl font-bold text-muted">{discount.max_installments}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-muted font-semibold">
                                                <FaCalendarAlt className="text-primary/40" />
                                                <span>{discount.valid_until ? new Date(discount.valid_until).toLocaleDateString() : 'Sin Límite'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                                discount.is_active 
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                                {discount.is_active ? <FaCheckCircle /> : <FaTimesCircle />}
                                                {discount.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <CreateDiscountModal
                    onClose={() => setShowModal(false)}
                    onCreated={fetchDiscounts}
                />
            )}
        </div>
    );
}
