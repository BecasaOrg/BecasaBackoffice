"use client";

import { UserInterface } from '@/interfaces/user.interface';
import React, { useState } from 'react';
import { FaTrash, FaEye } from "react-icons/fa";
import UserDetailModal from './UserDetailModal';

interface Props {
    user: UserInterface;
}

export default function UserCard({ user }: Props) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="border border-secondary-light p-4 rounded-xl bg-secondary flex justify-between items-center hover:bg-secondary-light transition-colors mb-2 cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                {/* Avatar + Info */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary font-bold text-lg shrink-0">
                        {user.name?.charAt(0)}{user.last_name?.charAt(0)}
                    </div>
                    <div>
                        <p className='text-primary font-bold text-lg leading-tight'>{user.name} {user.last_name}</p>
                        <p className='text-muted text-sm'>{user.email}</p>
                        {user.sport && (
                            <p className='text-gray-400 text-xs mt-0.5'>🏅 {user.sport} · {user.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-primary hover:scale-110 transition-transform cursor-pointer"
                        title="Ver detalles"
                    >
                        <FaEye size={18} />
                    </button>
                    <button
                        className="text-red-400 hover:scale-110 transition-transform cursor-pointer"
                        title="Eliminar usuario"
                    >
                        <FaTrash size={16} />
                    </button>
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