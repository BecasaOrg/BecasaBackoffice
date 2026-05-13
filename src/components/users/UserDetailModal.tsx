"use client";

import { UserInterface } from '@/interfaces/user.interface';
import React from 'react';
import Image from 'next/image';
import {
    FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar,
    FaRunning, FaSchool, FaVenusMars, FaGlobe, FaWhatsapp,
    FaMapMarkerAlt, FaBirthdayCake, FaFilePdf
} from 'react-icons/fa';

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

function calcAge(birthDate?: string | null): string {
    if (!birthDate) return 'N/A';
    const bd = new Date(birthDate);
    const age = Math.floor((Date.now() - bd.getTime()) / (365.25 * 24 * 3600 * 1000));
    return `${bd.toLocaleDateString('es-CO')} (${age} años)`;
}

export default function UserDetailModal({ user, onClose }: Props) {
    const genderLabel = user.gender === 'M' ? 'Masculino' : user.gender === 'F' ? 'Femenino' : (user.gender || 'N/A');
    const cityName = user.city?.name || 'N/A';
    const countryName = user.birth_country?.name || (user as any).birthCountry?.name || 'N/A';

    const exportPDF = () => {
        const gradYear = user.graduation_year ? `Graduación ${user.graduation_year}` : 'N/A';
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) return;

        printWindow.document.write(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Perfil — ${user.name} ${user.last_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 40px; }
    .header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; border-bottom: 3px solid #9ccc00; padding-bottom: 20px; }
    .avatar { width: 72px; height: 72px; border-radius: 50%; background: #9ccc00; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: #1a1a1a; flex-shrink: 0; overflow: hidden; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .header-info h1 { font-size: 26px; font-weight: 900; color: #111; }
    .header-info p { font-size: 13px; color: #666; margin-top: 2px; }
    .badge { display: inline-block; background: #e8f5c8; color: #5a7a00; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 999px; border: 1px solid #9ccc00; margin-top: 6px; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #9ccc00; margin-bottom: 14px; padding-bottom: 6px; border-bottom: 1px solid #e0e0e0; }
    .section { margin-bottom: 28px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { background: #f8f8f8; border: 1px solid #e8e8e8; border-radius: 8px; padding: 12px 14px; }
    .field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 4px; }
    .field-value { font-size: 14px; font-weight: 600; color: #111; }
    .highlight { background: #f0f9d6; border-color: #c5e87a; }
    .footer { margin-top: 40px; text-align: right; font-size: 11px; color: #bbb; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="avatar">
      ${user.avatar ? `<img src="${user.avatar}" alt="avatar"/>` : `${(user.name || '?').charAt(0)}${(user.last_name || '').charAt(0)}`}
    </div>
    <div class="header-info">
      <h1>${user.name} ${user.last_name}</h1>
      <p>${user.email}</p>
      <span class="badge">Estudiante · ${user.sport || 'Sin deporte'}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📋 Información Personal de la Cuenta</div>
    <div class="grid">
      <div class="field highlight">
        <div class="field-label">Fecha de Nacimiento / Edad</div>
        <div class="field-value">${calcAge(user.birth_date)}</div>
      </div>
      <div class="field highlight">
        <div class="field-label">Género</div>
        <div class="field-value">${genderLabel}</div>
      </div>
      <div class="field highlight">
        <div class="field-label">WhatsApp</div>
        <div class="field-value">${user.phone || 'N/A'}</div>
      </div>
      <div class="field highlight">
        <div class="field-label">Correo Electrónico</div>
        <div class="field-value">${user.email || 'N/A'}</div>
      </div>
      <div class="field highlight">
        <div class="field-label">Ciudad</div>
        <div class="field-value">${cityName}</div>
      </div>
      <div class="field highlight">
        <div class="field-label">Grado Escolar</div>
        <div class="field-value">${gradYear}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🌍 Información Adicional</div>
    <div class="grid-2">
      <div class="field">
        <div class="field-label">País de Nacimiento</div>
        <div class="field-value">${countryName}</div>
      </div>
      <div class="field">
        <div class="field-label">Deporte</div>
        <div class="field-value">${user.sport || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="field-label">Rol en el Sistema</div>
        <div class="field-value">${user.role || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="field-label">Miembro desde</div>
        <div class="field-value">${user.created_at ? new Date(user.created_at).toLocaleDateString('es-CO') : 'N/A'}</div>
      </div>
    </div>
  </div>

  <div class="footer">Generado el ${new Date().toLocaleString('es-CO')} · Backoffice Becasa</div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`);
        printWindow.document.close();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-secondary rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-secondary-light/60 backdrop-blur-md px-6 py-5 flex justify-between items-center border-b border-secondary-light">
                    <div className="flex items-center gap-4">
                        {user?.avatar
                            ? <Image src={user.avatar} alt={`Avatar de ${user.name}`} width={52} height={52} className="rounded-2xl object-cover bg-secondary-light border border-primary/20" />
                            : <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#8bc200] flex items-center justify-center text-secondary font-black text-xl shadow-lg border border-primary/30">
                                {user.name?.charAt(0)}{user.last_name?.charAt(0)}
                            </div>
                        }
                        <div>
                            <h2 className="text-white font-black text-xl tracking-tight">{user.name} {user.last_name}</h2>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Estudiante · {user.sport || 'Sin deporte'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportPDF}
                            className="flex items-center gap-2 bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg"
                            title="Exportar perfil como PDF"
                        >
                            <FaFilePdf size={13} />
                            Exportar PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-muted hover:text-white hover:bg-secondary-light rounded-xl transition-all"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Información Personal — sección destacada */}
                    <div className="bg-gradient-to-br from-primary/10 to-secondary-light/30 rounded-2xl p-5 border border-primary/20">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaUser className="text-primary" /> Información Personal de la Cuenta
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <InfoCard
                                icon={<FaBirthdayCake className="text-primary" size={13} />}
                                label="Fecha de Nacimiento"
                                value={calcAge(user.birth_date)}
                            />
                            <InfoCard
                                icon={<FaVenusMars className="text-primary" size={13} />}
                                label="Género"
                                value={genderLabel}
                            />
                            <InfoCard
                                icon={<FaWhatsapp className="text-primary" size={13} />}
                                label="WhatsApp"
                                value={user.phone || 'N/A'}
                            />
                            <InfoCard
                                icon={<FaEnvelope className="text-primary" size={13} />}
                                label="Correo Electrónico"
                                value={user.email || 'N/A'}
                            />
                            <InfoCard
                                icon={<FaMapMarkerAlt className="text-primary" size={13} />}
                                label="Ciudad"
                                value={cityName}
                            />
                            <InfoCard
                                icon={<FaSchool className="text-primary" size={13} />}
                                label="Grado Escolar"
                                value={user.graduation_year ? `Graduación ${user.graduation_year}` : 'N/A'}
                            />
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-secondary-light/30 rounded-2xl p-5 border border-secondary-light/50">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FaGlobe className="text-primary" /> Información Adicional
                        </h3>
                        <div className="space-y-1">
                            <Field label="País de nacimiento" value={countryName} icon={<FaGlobe />} />
                            <Field label="Deporte" value={user.sport} icon={<FaRunning />} />
                            <Field label="Rol en el sistema" value={user.role} icon={<FaUser />} />
                            <Field label="Miembro desde" value={user.created_at ? new Date(user.created_at).toLocaleDateString('es-CO') : undefined} icon={<FaCalendar />} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-secondary-light/30 border-t border-secondary-light flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-primary text-secondary font-black px-6 py-2 rounded-xl hover:scale-105 transition-transform cursor-pointer text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-secondary/60 rounded-xl p-3 border border-secondary-light/50">
            <div className="flex items-center gap-1.5 mb-1">
                {icon}
                <span className="text-[10px] font-black text-muted uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-white text-sm font-semibold leading-snug">{value}</p>
        </div>
    );
}
