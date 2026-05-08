import { RegistrationInterface } from '@/interfaces/registration.interface';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUser, FaUmbrellaBeach, FaPhone, FaEnvelope, FaIdCard, FaGraduationCap, FaHeartbeat, FaMoneyBillWave, FaFilePdf } from 'react-icons/fa';

interface Props {
    registration: RegistrationInterface;
    onClose: () => void;
}

export default function RegistrationDetailModal({ registration, onClose }: Props) {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    

    useEffect(() => {
        if (!registration.health_insurance_path) return;

        let objectUrl: string | null = null;

        fetch(`/api/registrations/${registration.id}/file`)
            .then(res => res.blob())
            .then(blob => {
                objectUrl = URL.createObjectURL(blob);
                setFileUrl(objectUrl);
            })
            .catch(console.error);

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [registration.id, registration.health_insurance_path]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-secondary w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-secondary-light flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-secondary-light bg-secondary/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                            <FaUser size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {registration.user?.name} {registration.user?.last_name}
                            </h2>
                            <p className="text-primary font-medium text-sm">Detalles del Registro #{registration.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-muted hover:text-white hover:bg-secondary-light rounded-xl transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Información del Deportista */}
                        <div className="bg-secondary-light/30 rounded-2xl p-5 border border-secondary-light/50">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaUser className="text-primary" /> Información del Deportista
                            </h3>
                            <div className="space-y-3">
                                <DetailItem label="Correo" value={registration.user?.email || 'N/A'} />
                                <DetailItem label="Identificación" value={`${registration.identification_type} ${registration.identification_number}`} />
                                <DetailItem label="Talla de Camiseta" value={registration.shirt_size} />
                                <DetailItem label="Posición" value={registration.position} />
                                <DetailItem label="Nivel" value={registration.skill_level} />
                                <DetailItem label="Años de Experiencia" value={`${registration.years_experience} años`} />
                                <DetailItem label="Club Actual" value={registration.club_name || 'Ninguno'} />
                                <DetailItem label="Colegio" value={registration.school_name} />
                            </div>
                        </div>

                        {/* Información del Campamento y Pago */}
                        <div className="space-y-6">
                            <div className="bg-secondary-light/30 rounded-2xl p-5 border border-secondary-light/50">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaUmbrellaBeach className="text-primary" /> Campamento
                                </h3>
                                <div className="space-y-3">
                                    <DetailItem label="Nombre" value={registration.camp?.name || `ID: ${registration.camp_id}`} />
                                    <DetailItem label="Fecha de Registro" value={new Date(registration.created_at).toLocaleDateString('es-CO')} />
                                </div>
                            </div>

                            <div className="bg-secondary-light/30 rounded-2xl p-5 border border-secondary-light/50">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-primary" /> Detalles de Pago
                                </h3>
                                <div className="space-y-3">
                                    <DetailItem label="Estado" value={
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${registration.payment_status === 'pagado' || registration.payment_status === 'paid'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {registration.payment_status}
                                        </span>
                                    } />
                                    <DetailItem label="Precio Total" value={formatCurrency(registration.total_price)} />
                                    <DetailItem label="Cuotas" value={registration.installments_count.toString()} />
                                </div>
                            </div>
                        </div>

                        {/* Información del Acudiente */}
                        <div className="bg-secondary-light/30 rounded-2xl p-5 border border-secondary-light/50">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaIdCard className="text-primary" /> Información del Acudiente
                            </h3>
                            <div className="space-y-3">
                                <DetailItem label="Nombre" value={registration.guardian_name} icon={<FaUser size={12} className="text-muted" />} />
                                <DetailItem label="Teléfono" value={registration.guardian_phone} icon={<FaPhone size={12} className="text-muted" />} />
                                <DetailItem label="Correo" value={registration.guardian_email} icon={<FaEnvelope size={12} className="text-muted" />} />
                            </div>
                        </div>

                        {/* Información Médica */}
                        <div className="bg-secondary-light/30 rounded-2xl p-5 border border-secondary-light/50">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaHeartbeat className="text-primary" /> Información Médica
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">Restricciones Alimentarias</span>
                                    <p className="text-sm text-white bg-secondary/50 p-3 rounded-xl border border-secondary-light/30">
                                        {registration.dietary_restrictions || 'Ninguna'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">Condiciones Médicas</span>
                                    <p className="text-sm text-white bg-secondary/50 p-3 rounded-xl border border-secondary-light/30">
                                        {registration.medical_conditions || 'Ninguna'}
                                    </p>
                                </div>
                                {registration.health_insurance_path && fileUrl && (
                                    <div className="pt-2 space-y-3">
                                        <div className="bg-secondary/50 rounded-xl border border-secondary-light/30 overflow-hidden">
                                            {showPreview ? (
                                                <div className="relative">
                                                    <embed
                                                        src={fileUrl}
                                                        type="application/pdf"
                                                        className="w-full h-[400px]"
                                                    />
                                                    <button
                                                        onClick={() => setShowPreview(false)}
                                                        className="absolute top-2 right-2 p-2 bg-secondary/80 hover:bg-secondary text-muted hover:text-white rounded-lg transition-all"
                                                    >
                                                        <FaTimes size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowPreview(true)}
                                                    className="w-full flex items-center gap-3 px-4 py-6 hover:bg-primary/5 transition-colors group"
                                                >
                                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                                        <FaFilePdf size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-bold text-white">Certificado EPS</p>
                                                        <p className="text-xs text-muted">Haz clic para previsualizar</p>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all text-sm font-bold"
                                        >
                                            <FaFilePdf /> Ver Certificado Completo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value, icon }: { label: string, value: React.ReactNode, icon?: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                {icon} {label}
            </span>
            <span className="text-sm font-semibold text-white">{value}</span>
        </div>
    );
}
