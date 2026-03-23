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
            className={'tw4l-emtxt715 tw4l-emtxt7o tw4l-emtxt7y tw4l-emtxt712'}
        >
            {children}
        </button>
    );
};
