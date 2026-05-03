"use client";

import { UserInterface } from '@/interfaces/user.interface';
import React, { useState, useMemo } from 'react';
import { FaEye, FaSearch, FaFilter, FaRunning, FaVenusMars, FaTrash } from 'react-icons/fa';
import UserDetailModal from './UserDetailModal';

interface Props {
    users: UserInterface[];
}

export default function UserTableClient({ users }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sportFilter, setSportFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

    // DEBUG: Ver qué llega exactamente
    if (users.length > 0) {
        console.log('DEBUG USER DATA:', users[0]);
    }

    // Get unique sports for the filter dropdown
    const uniqueSports = useMemo(() => {
        const sports = users.map(user => user.sport).filter(Boolean);
        return Array.from(new Set(sports)).sort();
    }, [users]);

    // Filter users
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                `${user.name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSport = sportFilter ? user.sport === sportFilter : true;
            const matchesGender = genderFilter ? user.gender === genderFilter : true;

            return matchesSearch && matchesSport && matchesGender;
        });
    }, [users, searchTerm, sportFilter, genderFilter]);

    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="bg-secondary/40 backdrop-blur-md p-5 rounded-3xl border border-secondary-light shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary-light/30 border border-secondary-light rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/70"
                    />
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative w-full md:w-48">
                        <FaRunning className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                        <select
                            value={sportFilter}
                            onChange={(e) => setSportFilter(e.target.value)}
                            className="w-full bg-secondary-light/30 border border-secondary-light rounded-xl pl-11 pr-4 py-3 text-white appearance-none focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                        >
                            <option value="">Todos los deportes</option>
                            {uniqueSports.map(sport => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                            <FaFilter size={12} />
                        </div>
                    </div>

                    <div className="relative w-full md:w-48">
                        <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="w-full bg-secondary-light/30 border border-secondary-light rounded-xl pl-11 pr-4 py-3 text-white appearance-none focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                        >
                            <option value="">Todos los géneros</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                            <FaFilter size={12} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-secondary/40 backdrop-blur-md rounded-3xl border border-secondary-light shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary-light/50 text-muted uppercase text-xs tracking-widest border-b border-secondary-light">
                                <th className="px-6 py-4 font-bold">Estudiante</th>
                                <th className="px-6 py-4 font-bold">Contacto</th>
                                <th className="px-6 py-4 font-bold">Deporte</th>
                                <th className="px-6 py-4 font-bold">Género</th>
                                <th className="px-6 py-4 font-bold">Graduación</th>
                                <th className="px-6 py-4 font-bold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-light/50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted">
                                        No se encontraron estudiantes con los filtros aplicados.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-secondary-light/20 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#8bc200] flex items-center justify-center text-secondary font-bold text-sm shadow-md">
                                                    {user.name?.charAt(0)}{user.last_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{user.name} {user.last_name}</div>
                                                    <div className="text-xs text-muted">
                                                        {user.city?.name ? `${user.city.name}, ` : ''}
                                                        {user.birth_country?.name || (user as any).birthCountry?.name || 'Ubicación no especificada'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-white">{user.email}</div>
                                            <div className="text-xs text-muted">{user.phone || 'Sin teléfono'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-light/50 text-primary text-xs font-semibold border border-primary/20">
                                                <FaRunning size={10} />
                                                {user.sport || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white">
                                                {user.gender === 'M' ? 'Masculino' : user.gender === 'F' ? 'Femenino' : (user.gender || 'N/A')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white font-medium">{user.graduation_year || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="w-9 h-9 bg-secondary-light rounded-xl flex items-center justify-center text-primary border border-secondary-light hover:bg-primary hover:text-secondary transition-all"
                                                    title="Ver detalles"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                                {/* <button className='w-9 h-9 bg-secondary-light rounded-xl flex items-center justify-center text-primary border border-secondary-light hover:bg-primary hover:text-secondary transition-all'>
                                                    <FaTrash size={14} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}
