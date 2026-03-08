import { BackgroundEventListener } from '@extension/src/background/services/background-event.listener';

new BackgroundEventListener(chrome.runtime.onMessage);
