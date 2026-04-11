import React from 'react';

interface ButtonProps {
    title: string;
    children: React.ReactNode;
    onClick: () => void;
}

export const Button = ({ title, children, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            title={title}
            className={'tw3v-emtxt715 tw3v-emtxt7o tw3v-emtxt7y tw3v-emtxt712'}
        >
            {children}
        </button>
    );
};
