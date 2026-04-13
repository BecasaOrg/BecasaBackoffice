import { UserInterface } from '@/interfaces/user.interface';
import { colors } from '@/utils/constants/colors';
import React from 'react';

interface Props {
    user: UserInterface;
}

export default function UserCard({ user }: Props) {
    return (
        <div className={`border border-black p-3 rounded-[10px] bg-secondary`}>
            <div>
                <p className='text-primary font-bold text-xl'>{user.name} {user.last_name}</p>
                <p className='text-gray-300'>Correo: {user.email}</p>
            </div>
            <div>
            
            </div>
        </div>
    );
}