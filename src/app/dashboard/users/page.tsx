import { UserInterface } from '@/interfaces/user.interface';
import { cookies } from 'next/headers';
import React from 'react';
import { FaUsers } from 'react-icons/fa';
import UserTableClient, { PaginationMeta } from '@/components/users/UserTableClient';

export default async function Page(props: { searchParams?: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = searchParams?.page || '1';

    const cookiesResolved = await cookies();
    const token = cookiesResolved.get('auth_token')?.value;

    const datos = await fetch(`${process.env.API_URL}/users?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'force-cache',
        next: { revalidate: 30 }
    });

    const responseData = await datos.json();

    let users: UserInterface[] = [];
    let pagination: PaginationMeta = { currentPage: 1, lastPage: 1, total: 0, perPage: 10, from: 0, to: 0 };

    if (Array.isArray(responseData)) {
        users = responseData;
        pagination = { currentPage: 1, lastPage: 1, total: users.length, perPage: users.length, from: 1, to: users.length };
    } else if (responseData?.data && Array.isArray(responseData.data)) {
        users = responseData.data;
        pagination = {
            currentPage: responseData.current_page || 1,
            lastPage: responseData.last_page || 1,
            total: responseData.total || users.length,
            perPage: responseData.per_page || users.length,
            from: responseData.from || 0,
            to: responseData.to || users.length,
        };
    }

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
                    <span className="text-primary font-black text-xl">{pagination.total}</span>
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
                <UserTableClient users={users} pagination={pagination} />
            )}
        </div>
    );
}
