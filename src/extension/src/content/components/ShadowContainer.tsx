import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ShadowContainerProps {
    children: React.ReactNode;
}

/**
 * @param children
 * @constructor
 */
export const ShadowContainer: React.FC<ShadowContainerProps> = ({
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

    useEffect(() => {
        if (containerRef.current && !shadowRoot) {
            const root = containerRef.current.attachShadow({ mode: 'open' });
            setShadowRoot(root);
        }
    }, [shadowRoot]);

    return (
        <div ref={containerRef} style={{ display: 'block', width: '100%' }}>
            {shadowRoot && createPortal(children, shadowRoot)}
        </div>
    );
};
