import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge("bg-gray-50 shadow-sm rounded-xl border border-gray-200/60 overflow-hidden", className)}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
