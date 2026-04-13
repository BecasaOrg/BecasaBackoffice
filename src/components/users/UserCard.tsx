import { UserInterface } from '@/interfaces/user.interface';
import React from 'react';
import { FaTrash } from "react-icons/fa";

interface Props {
    user: UserInterface;
}

export default function UserCard({ user }: Props) {
    return (
        <div className={`border border-black p-3 rounded-[10px] bg-secondary flex justify-between items-center`}>
            <div>
                <p className='text-primary font-bold text-xl'>{user.name} {user.last_name}</p>
                <p className='text-gray-300'><span className='text-primary'>Correo:</span> {user.email}</p>
            </div>
            <div>
                <div className='cursor-pointer'>
                    <FaTrash color='#b8ff05' />
                </div>
            </div>
        </div>
    );
}