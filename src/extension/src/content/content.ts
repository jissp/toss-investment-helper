import { BackgroundEventType } from '@extension/src/types/background-event.types';
import { ContentEventListener } from './content-event.listener';

function init() {
    new ContentEventListener(chrome.runtime.onMessage);

    // TossInvestmentHelper 서버가 동작중일 때만 설치합니다.
    chrome.runtime.sendMessage({
        type: BackgroundEventType.HealthCheckRequest,
    });
}

init();
