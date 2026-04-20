"use client";

import React, { useEffect, useState } from 'react';
import { FaUsers, FaSearchLocation, FaClipboardList, FaTag, FaArrowRight, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
// Helper simple para calcular tiempo relativo sin librerías externas
const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return 'hace unos segundos';
};

const StatCard = ({ title, value, icon: Icon, color, loading }: any) => (
    <div className="bg-secondary/40 backdrop-blur-md border border-secondary-light p-6 rounded-3xl hover:border-primary/50 transition-all group overflow-hidden relative">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-primary/20 bg-primary/10 text-primary`}>
                <Icon size={20} />
            </div>
        </div>
        <h3 className="text-muted text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
        {loading ? (
            <div className="h-9 w-20 bg-secondary-light/30 animate-pulse rounded-lg mt-1" />
        ) : (
            <p className="text-4xl font-black text-white italic tracking-tighter">{value}</p>
        )}
    </div>
);

const QuickAction = ({ title, href, description }: any) => (
    <Link href={href} className="flex items-center justify-between p-4 rounded-2xl bg-secondary-light/30 border border-secondary-light hover:bg-primary/10 hover:border-primary/30 transition-all group">
        <div>
            <h4 className="text-white font-bold text-sm tracking-tight">{title}</h4>
            <p className="text-muted text-[10px] uppercase font-black tracking-widest">{description}</p>
        </div>
        <FaArrowRight className="text-muted group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 transition-transform" />
    </Link>
);

export default function DashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        camps: 0,
        registrations: 0,
        discounts: 0,
        recentActivity: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            setLoading(true);
            try {
                const [usersRes, campsRes, regsRes, discountsRes] = await Promise.all([
                    fetch('/api/user').then(r => r.json()),
                    fetch('/api/camps').then(r => r.json()),
                    fetch('/api/registrations').then(r => r.json()),
                    fetch('/api/discount-codes').then(r => r.json())
                ]);

                // Helper to get data regardless of wrapper
                const getData = (data: any) => {
                    if (Array.isArray(data)) return data;
                    if (Array.isArray(data?.data)) return data.data;
                    if (Array.isArray(data?.users)) return data.users;
                    if (Array.isArray(data?.camps)) return data.camps;
                    if (Array.isArray(data?.registrations)) return data.registrations;
                    if (Array.isArray(data?.discount_codes)) return data.discount_codes;
                    return [];
                };

                const users = getData(usersRes);
                const camps = getData(campsRes);
                const regs = getData(regsRes);
                const discounts = getData(discountsRes);

                setStats({
                    users: users.length,
                    camps: camps.length,
                    registrations: regs.length,
                    discounts: discounts.length,
                    recentActivity: regs.slice(0, 5) // Take 5 most recent
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-secondary/60 to-secondary/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-secondary-light overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-primary/20">
                            Dashboard Administrativo
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mt-4 italic tracking-tighter">
                            Bienvenido al <span className="text-primary not-italic">Backoffice</span>
                        </h1>
                        <p className="text-muted font-medium mt-2 max-w-md mx-auto md:mx-0">
                            Datos actualizados en tiempo real directamente desde la base de datos de producción.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Estudiantes" value={stats.users} icon={FaUsers} loading={loading} />
                <StatCard title="Campamentos" value={stats.camps} icon={FaSearchLocation} loading={loading} />
                <StatCard title="Inscripciones" value={stats.registrations} icon={FaClipboardList} loading={loading} />
                <StatCard title="Descuentos" value={stats.discounts} icon={FaTag} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-secondary/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-secondary-light shadow-xl min-h-[400px]">
                        <h2 className="text-xl font-black text-white italic mb-6">Actividad Reciente</h2>
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-20 bg-secondary-light/20 animate-pulse rounded-3xl border border-secondary-light/30" />
                                ))
                            ) : stats.recentActivity.length === 0 ? (
                                <div className="text-center py-20 opacity-20">
                                    <FaChartLine size={48} className="mx-auto mb-4" />
                                    <p className="text-xl font-bold">Sin actividad reciente</p>
                                </div>
                            ) : (
                                stats.recentActivity.map((activity, i) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-3xl bg-secondary-light/20 border border-secondary-light/30 hover:bg-primary/5 hover:border-primary/20 transition-all group">
                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <FaChartLine />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-base font-bold">
                                                {activity.user?.name} {activity.user?.last_name} se inscribió
                                            </p>
                                            <p className="text-muted text-[10px] uppercase font-black tracking-widest">
                                                {activity.camp?.name || `Campamento ID: ${activity.camp_id}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-primary text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                {activity.created_at ? formatTimeAgo(new Date(activity.created_at)) : 'Recientemente'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-secondary/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-secondary-light shadow-xl">
                        <h2 className="text-xl font-black text-white italic mb-6">Accesos Rápidos</h2>
                        <div className="flex flex-col gap-3">
                            <QuickAction title="Crear Campamento" href="/dashboard/camps" description="Configurar nueva sede" />
                            <QuickAction title="Ver Estudiantes" href="/dashboard/users" description="Gestionar perfiles" />
                            <QuickAction title="Revisar Pagos" href="/dashboard/registrations" description="Estado de inscripciones" />
                            <QuickAction title="Generar Cupón" href="/dashboard/discounts" description="Códigos de descuento" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}