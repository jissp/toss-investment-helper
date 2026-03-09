import { BackgroundEventListener } from './background-event.listener';

new BackgroundEventListener(chrome.runtime.onMessage);
