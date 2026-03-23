import { useEffect } from 'react';
import { RouterObserver } from '@extension/src/content/observers';

/**
 * URL 변경을 감지하는 Custom Hook
 *
 * RouterObserver를 구독하여 URL이 변경될 때마다 콜백을 실행합니다.
 * useEffect의 cleanup 함수에서 자동으로 구독을 해제하므로 메모리 누수가 발생하지 않습니다.
 *
 * @param callback - URL이 변경될 때 호출할 콜백 함수. 새 URL을 인자로 받습니다.
 */
export const useUrlChange = (callback: (url: string) => void) => {
    useEffect(() => {
        const unsubscribe = RouterObserver.getInstance().onUrlChange(callback);

        return () => unsubscribe();
    }, [callback]);
};
