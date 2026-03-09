import { BackgroundEventListener } from './services/background-event.listener';

new BackgroundEventListener(chrome.runtime.onMessage);
