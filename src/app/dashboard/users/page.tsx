import { UserInterface } from '@/interfaces/user.interface';
import { cookies } from 'next/headers';
import React from 'react';
import { FaUsers } from 'react-icons/fa';
import UserTableClient from '@/components/users/UserTableClient';

export default async function Page() {
    const cookiesResolved = await cookies();
    const token = cookiesResolved.get('auth_token')?.value;

    const datos = await fetch(`${process.env.API_URL}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });
    
    const responseData = await datos.json();
    let users: UserInterface[] = [];
    
    // Robust parsing
    if (Array.isArray(responseData)) users = responseData;
    else if (Array.isArray(responseData?.data)) users = responseData.data;

    return (
        <div className="space-y-8">
            {/* Header Pro */}
            <div className="flex justify-between items-center bg-secondary/40 backdrop-blur-md p-6 rounded-3xl border border-secondary-light shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                        <FaUsers size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Estudiantes</h1>
                        <p className="text-muted text-sm font-medium">Búsqueda y gestión de perfiles deportivos</p>
                    </div>
                </div>
                
                <div className="bg-secondary-light px-4 py-2 rounded-2xl border border-secondary-light flex items-center gap-2">
                    <span className="text-primary font-black text-xl">{users.length}</span>
                    <span className="text-muted text-xs font-bold uppercase tracking-widest pt-1">Registrados</span>
                </div>
            </div>

            {/* Table View */}
            {users.length === 0 ? (
                <div className="bg-secondary/40 backdrop-blur-md rounded-3xl border border-secondary-light p-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                        <FaUsers size={64} className="text-muted" />
                        <p className="text-2xl font-bold text-muted">No se encontraron estudiantes</p>
                    </div>
                </div>
            ) : (
                <UserTableClient users={users} />
            )}
        </div>
    );
}