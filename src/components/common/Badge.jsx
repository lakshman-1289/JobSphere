import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'primary', className }) => {
    const variants = {
        primary: 'bg-brand-50 text-brand-700 border border-brand-200',
        success: 'bg-green-50 text-green-700 border border-green-200',
        warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        error: 'bg-red-50 text-red-700 border border-red-200',
        gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    };

    return (
        <span className={twMerge(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
            variants[variant] || variants.gray,
            className
        )}>
            {children}
        </span>
    );
};

export default Badge;
