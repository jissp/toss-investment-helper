import React from 'react';

export const Skeleton: React.FC = () => {
    return (
        <div
            style={{
                width: '100%',
                height: '40px',
                backgroundColor: 'rgb(23, 23, 28)',
                borderRadius: '8px',
                animation: 'pulse 1.5s infinite ease-in-out',
            }}
        >
            <style>
                {`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                `}
            </style>
        </div>
    );
};
