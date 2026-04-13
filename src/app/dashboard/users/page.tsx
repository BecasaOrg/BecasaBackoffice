import UserCard from '@/components/users/UserCard';
import { UserInterface } from '@/interfaces/user.interface';
import { cookies } from 'next/headers';
import React from 'react';

export default async function Page() {

    const cookiesResolved = await cookies();
    const datos = await fetch(`${process.env.API_URL}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${cookiesResolved.get('auth_token')?.value}`
        }
    });
    const users = await datos.json();
    // console.log(await datos.json());

    return (
        <>
            <h2 className='text-black'>Usuarios:</h2>
            {
                users.map((user: UserInterface) => {
                    return (
                        <UserCard key={user.id} user={user} />
                    );
                })
            }
        </>
    );
}