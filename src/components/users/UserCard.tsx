"use client";

import { UserInterface } from '@/interfaces/user.interface';
import React, { useState } from 'react';
import { FaTrash, FaEye, FaRunning, FaMars, FaVenus, FaUserGraduate } from "react-icons/fa";
import UserDetailModal from './UserDetailModal';

interface Props {
    user: UserInterface;
}

export default function UserCard({ user }: Props) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div 
                className="group relative bg-secondary/40 backdrop-blur-md border border-secondary-light p-6 rounded-3xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(175,255,0,0.1)] transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setShowModal(true)}
            >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex flex-col gap-5">
                    {/* Header: Avatar + Top Info */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-[#8bc200] flex items-center justify-center text-secondary shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-black italic">
                                    {user.name?.charAt(0)}{user.last_name?.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-xl leading-tight tracking-tight group-hover:text-primary transition-colors">
                                    {user.name} {user.last_name}
                                </h3>
                                <p className="text-muted text-sm font-medium opacity-80">{user.email}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                            <button className="w-10 h-10 bg-secondary-light rounded-xl flex items-center justify-center text-primary border border-secondary-light hover:bg-primary hover:text-secondary transition-all">
                                <FaEye size={16} />
                            </button>
                            {/* <button className="w-10 h-10 bg-secondary-light rounded-xl flex items-center justify-center text-red-400 border border-secondary-light hover:bg-red-500 hover:text-white transition-all">
                                <FaTrash size={14} />
                            </button> */}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <div className="bg-secondary-light/30 p-3 rounded-2xl border border-secondary-light flex items-center gap-3">
                            <div className="text-primary/60"><FaRunning size={14} /></div>
                            <div>
                                <p className="text-[10px] text-muted font-black uppercase tracking-widest">Deporte</p>
                                <p className="text-white font-bold text-sm">{user.sport || 'General'}</p>
                            </div>
                        </div>
                        <div className="bg-secondary-light/30 p-3 rounded-2xl border border-secondary-light flex items-center gap-3">
                            <div className="text-primary/60">
                                {user.gender === 'M' ? <FaMars size={14} /> : <FaVenus size={14} />}
                            </div>
                            <div>
                                <p className="text-[10px] text-muted font-black uppercase tracking-widest">Género</p>
                                <p className="text-white font-bold text-sm">
                                    {user.gender === 'M' ? 'Masculino' : 'Femenino'}
                                </p>
                            </div>
                        </div>
                        <div className="col-span-2 bg-secondary-light/30 p-3 rounded-2xl border border-secondary-light flex items-center gap-3">
                            <div className="text-primary/60"><FaUserGraduate size={14} /></div>
                            <div>
                                <p className="text-[10px] text-muted font-black uppercase tracking-widest">Grado / Año</p>
                                <p className="text-white font-bold text-sm">Promoción {user.graduation_year || '2024'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <UserDetailModal
                    user={user}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}