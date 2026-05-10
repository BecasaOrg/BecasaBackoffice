"use client";

import { useState } from "react";
import { logoutAction } from "@/actions/login.action";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartBar, FaUsers, FaSearchLocation, FaClipboardList, FaTag, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FaChartBar /> },
  { name: "Usuarios", href: "/dashboard/users", icon: <FaUsers /> },
  { name: "Campamentos", href: "/dashboard/camps", icon: <FaSearchLocation /> },
  { name: "Registros", href: "/dashboard/registrations", icon: <FaClipboardList /> },
  { name: "Descuentos", href: "/dashboard/discounts", icon: <FaTag /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 p-4 bg-secondary rounded-xl text-white shadow-xl border border-secondary-light hover:bg-secondary-light transition-colors"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          w-72 bg-secondary text-white min-h-screen flex flex-col shadow-2xl border-r border-secondary-light
          fixed md:sticky top-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
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
                    onClick={() => setIsOpen(false)}
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
    </>
  );
}