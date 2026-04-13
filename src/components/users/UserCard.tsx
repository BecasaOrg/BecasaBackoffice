import { UserInterface } from '@/interfaces/user.interface';
import React from 'react';

interface Props {
    user: UserInterface;
}

export default function UserCard({ user }: Props) {
    return (
        <div className='border border-black p-3 rounded-[10px]'>
            <p className='text-black'>{user.name} {user.last_name}</p>
            <p className='text-black'>{user.email}</p>
            <p className='text-black'>{user.role}</p>
            <p></p>
        </div>
    );
}