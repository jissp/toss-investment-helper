import React, { CSSProperties } from 'react';

interface Props {
    id: string;
    children: React.ReactNode;
    width: CSSProperties['width'];
    height: CSSProperties['height'];
    handlePopupClose: () => void;
    isOpenedReportView: boolean;
}

export const PopupView: React.FC<Props> = ({
    id,
    width,
    height,
    children,
    handlePopupClose,
    isOpenedReportView,
}) => {
    return (
        <div
            id={id}
            className={'helper-container'}
            onClick={handlePopupClose}
            style={{
                display: isOpenedReportView ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    width,
                    height,
                    // WTS 다크 테마와 일치하는 색상
                    backgroundColor: 'rgb(23, 23, 28)',
                    // 미세한 테두리로 경계 강조
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    // 깊이감 있는 그림자
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
            >
                {children}
            </div>
        </div>
    );
};
