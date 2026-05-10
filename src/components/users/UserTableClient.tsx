"use client";

import { UserInterface } from '@/interfaces/user.interface';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaSearch, FaFilter, FaRunning, FaVenusMars, FaTrash, FaPen, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import UserDetailModal from './UserDetailModal';
import EditUserModal from './EditUserModal';

export interface PaginationMeta {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    from: number;
    to: number;
}

interface Props {
    users: UserInterface[];
    pagination: PaginationMeta;
}

export default function UserTableClient({ users, pagination }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sportFilter, setSportFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserInterface | null>(null);
    const router = useRouter();

    const { currentPage, lastPage, total, perPage, from, to } = pagination;

    // Get unique sports for the filter dropdown
    const uniqueSports = useMemo(() => {
        const sports = users.map(user => user.sport).filter(Boolean);
        return Array.from(new Set(sports)).sort();
    }, [users]);

    // Client-side filter within current page
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

    // Generate visible page numbers
    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        if (lastPage <= maxVisible + 2) {
            for (let i = 1; i <= lastPage; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(lastPage - 1, currentPage + 1);
            if (currentPage <= 3) { start = 2; end = Math.min(maxVisible, lastPage - 1); }
            if (currentPage >= lastPage - 2) { start = Math.max(2, lastPage - maxVisible + 1); end = lastPage - 1; }
            if (start > 2) pages.push('...');
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < lastPage - 1) pages.push('...');
            pages.push(lastPage);
        }
        return pages;
    }, [lastPage, currentPage]);

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
                                                {
                                                    user.avatar ? (
                                                        <Image
                                                            src={user.avatar}
                                                            alt={`Avatar de ${user.name}`}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover w-10 h-10 rounded-full bg-secondary-light"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#8bc200] flex items-center justify-center text-secondary font-bold text-sm shadow-md">
                                                            {user.name?.charAt(0)}{user.last_name?.charAt(0)}
                                                        </div>
                                                    )
                                                }
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
                                            <div className="flex justify-center gap-3">
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
                                                <button
                                                    onClick={() => setUserToEdit(user)}
                                                    className="w-9 h-9 bg-secondary-light rounded-xl flex items-center justify-center text-primary border border-secondary-light hover:bg-primary hover:text-secondary transition-all"
                                                    title="Editar estudiante"
                                                >
                                                    <FaPen size={14} />
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

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex items-center justify-between bg-secondary/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-secondary-light shadow-xl">
                    <span className="text-muted text-sm">
                        Mostrando {from}-{to} de {total}
                    </span>
                    <div className="flex items-center gap-1">
                        {currentPage > 1 && (
                            <Link
                                href={`/dashboard/users?page=${currentPage - 1}`}
                                scroll={false}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-white hover:bg-secondary-light transition-all cursor-pointer"
                            >
                                <FaChevronLeft size={12} />
                            </Link>
                        )}
                        {pageNumbers.map((page, idx) =>
                            typeof page === 'string' ? (
                                <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted text-sm">...</span>
                            ) : (
                                <Link
                                    key={page}
                                    href={`/dashboard/users?page=${page}`}
                                    scroll={false}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${page === currentPage
                                        ? 'bg-primary text-secondary'
                                        : 'text-muted hover:text-white hover:bg-secondary-light'
                                        }`}
                                >
                                    {page}
                                </Link>
                            )
                        )}
                        {currentPage < lastPage && (
                            <Link
                                href={`/dashboard/users?page=${currentPage + 1}`}
                                scroll={false}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-white hover:bg-secondary-light transition-all cursor-pointer"
                            >
                                <FaChevronRight size={12} />
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
            {userToEdit && (
                <EditUserModal
                    user={userToEdit}
                    onClose={() => setUserToEdit(null)}
                    onUpdated={() => router.refresh()}
                />
            )}
        </div>
    );
}
