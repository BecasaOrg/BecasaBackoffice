"use client";

import { logoutAction } from "@/actions/login.action";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartBar, FaUsers, FaSearchLocation, FaClipboardList, FaTag, FaSignOutAlt } from 'react-icons/fa';

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FaChartBar /> },
  { name: "Usuarios", href: "/dashboard/users", icon: <FaUsers /> },
  { name: "Campamentos", href: "/dashboard/camps", icon: <FaSearchLocation /> },
  { name: "Registros", href: "/dashboard/registrations", icon: <FaClipboardList /> },
  { name: "Descuentos", href: "/dashboard/discounts", icon: <FaTag /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-secondary text-white min-h-screen flex flex-col shadow-2xl border-r border-secondary-light">
      {/* Logo Area */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-secondary font-black text-2xl">B</div>
            <div>
                <h1 className="text-2xl font-black text-white leading-none">Becasa</h1>
                <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Backoffice</p>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(175,255,0,0.1)]"
                      : "text-muted hover:bg-secondary-light hover:text-white"
                  }`}
                >
                  <span className={`text-lg ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`}>
                    {item.icon}
                  </span>
                  <span className="font-semibold tracking-tight">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#afff00]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-secondary-light">
        <button
          onClick={() => logoutAction()}
          className="flex items-center gap-4 px-4 py-3 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 w-full group"
        >
          <FaSignOutAlt className="group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}