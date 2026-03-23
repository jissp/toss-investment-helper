import React, { useState } from 'react';
import { useBackendApi } from '../../../context';

/**
 * 최신 뉴스 AI 분석 버튼 컴포넌트
 */
export const LatestNewsAiAnalysisButton: React.FC = () => {
    const backend = useBackendApi();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        try {
            await backend.requestLatestNewsAiAnalysis();
            alert('최신 뉴스 AI 분석 요청이 완료되었습니다.');
        } catch (error) {
            console.error('Failed to request latest news AI analysis:', error);
            alert('최신 뉴스 AI 분석 요청에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: loading ? '#f2f4f6' : '#3182f6',
                    color: loading ? '#919ea9' : '#ffffff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: loading ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(49, 130, 246, 0.2)',
                }}
            >
                {loading ? 'AI 분석 중...' : '최신 뉴스 AI 요약'}
            </button>
        </div>
    );
};
