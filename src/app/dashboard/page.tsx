import { cookies } from "next/headers";
import { FaUsers, FaSearchLocation, FaClipboardList, FaTag, FaArrowRight, FaChartLine } from "react-icons/fa";
import Link from "next/link";

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

const getData = (data: any) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.camps)) return data.camps;
    if (Array.isArray(data?.registrations)) return data.registrations;
    if (Array.isArray(data?.discount_codes)) return data.discount_codes;
    return [];
};

async function getStats() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return { users: 0, camps: 0, registrations: 0, discounts: 0, recentActivity: [] };
    }

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    const [usersRes, campsRes, regsRes, discountsRes] = await Promise.all([
        fetch(`${process.env.API_URL}/users`, { headers, next: { revalidate: 60 } }),
        fetch(`${process.env.API_URL}/camps`, { headers, next: { revalidate: 60 } }),
        fetch(`${process.env.API_URL}/registrations`, { headers, next: { revalidate: 30 } }),
        fetch(`${process.env.API_URL}/discount-codes`, { headers, next: { revalidate: 60 } }),
    ]);

    const [users, camps, regs, discounts] = await Promise.all([
        usersRes.json(),
        campsRes.json(),
        regsRes.json(),
        discountsRes.json(),
    ]);

    const userData = getData(users);
    const campData = getData(camps);
    const regData = getData(regs);
    const discountData = getData(discounts);

    return {
        users: userData.length,
        camps: campData.length,
        registrations: regData.length,
        discounts: discountData.length,
        recentActivity: regData.slice(0, 5),
    };
}

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: any }) => (
    <div className="bg-secondary/40 backdrop-blur-md border border-secondary-light p-6 rounded-3xl hover:border-primary/50 transition-all group overflow-hidden relative">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-primary/20 bg-primary/10 text-primary`}>
                <Icon size={20} />
            </div>
        </div>
        <h3 className="text-muted text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-4xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
);

const QuickAction = ({ title, href, description }: { title: string; href: string; description: string }) => (
    <Link href={href} className="flex items-center justify-between p-4 rounded-2xl bg-secondary-light/30 border border-secondary-light hover:bg-primary/10 hover:border-primary/30 transition-all group">
        <div>
            <h4 className="text-white font-bold text-sm tracking-tight">{title}</h4>
            <p className="text-muted text-[10px] uppercase font-black tracking-widest">{description}</p>
        </div>
        <FaArrowRight className="text-muted group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 transition-transform" />
    </Link>
);


export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Estudiantes" value={stats.users} icon={FaUsers} />
                <StatCard title="Campamentos" value={stats.camps} icon={FaSearchLocation} />
                <StatCard title="Inscripciones" value={stats.registrations} icon={FaClipboardList} />
                <StatCard title="Descuentos" value={stats.discounts} icon={FaTag} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-secondary/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-secondary-light shadow-xl min-h-[400px]">
                        <h2 className="text-xl font-black text-white italic mb-6">Actividad Reciente</h2>
                        <div className="flex flex-col gap-4">
                            {stats.recentActivity.length === 0 ? (
                                <div className="text-center py-20 opacity-20">
                                    <FaChartLine size={48} className="mx-auto mb-4" />
                                    <p className="text-xl font-bold">Sin actividad reciente</p>
                                </div>
                            ) : (
                                stats.recentActivity.map((activity: any) => (
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
                                                {activity.created_at ? formatTimeAgo(new Date(activity.created_at)) : 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

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