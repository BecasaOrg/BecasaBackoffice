"use client";

import { UserInterface } from '@/interfaces/user.interface';
import React from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaRunning, FaSchool, FaVenusMars, FaGlobe } from 'react-icons/fa';

interface Props {
    user: UserInterface;
    onClose: () => void;
}

const Field = ({ label, value, icon }: { label: string; value?: string | number | null; icon?: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-2 border-b border-secondary-light last:border-0">
        {icon && <span className="text-primary mt-0.5 shrink-0">{icon}</span>}
        <div>
            <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
            <p className="text-white font-medium">{value ?? <span className="text-muted italic">No registrado</span>}</p>
        </div>
    </div>
);

export default function UserDetailModal({ user, onClose }: Props) {
    const genderLabel = user.gender === 'M' ? 'Masculino' : user.gender === 'F' ? 'Femenino' : user.gender;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-secondary rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-secondary-light px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-secondary font-bold text-xl">
                            {user.name?.charAt(0)}{user.last_name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">{user.name} {user.last_name}</h2>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Estudiante</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-white transition-colors cursor-pointer"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
                    <Field label="Correo electrónico" value={user.email} icon={<FaEnvelope />} />
                    <Field label="Teléfono" value={user.phone} icon={<FaPhone />} />
                    <Field label="Fecha de nacimiento" value={user.birth_date} icon={<FaCalendar />} />
                    <Field label="Género" value={genderLabel} icon={<FaVenusMars />} />
                    <Field label="Deporte" value={user.sport} icon={<FaRunning />} />
                    <Field label="País de nacimiento" value={user.birth_country?.name || (user as any).birthCountry?.name} icon={<FaGlobe />} />
                    <Field label="Ciudad" value={user.city?.name} icon={<FaGlobe />} />
                    <Field label="Año de graduación" value={user.graduation_year} icon={<FaSchool />} />
                    <Field label="Rol" value={user.role} icon={<FaUser />} />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-secondary-light flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-primary text-secondary font-bold px-5 py-2 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
