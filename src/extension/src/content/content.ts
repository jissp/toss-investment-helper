import { DomObserver, RouterObserver } from '@extension/src/content/observers';
import { ContentEventListener } from './content-event.listener';
import { BackendApiService, TemplateService } from './services';
import { ContentFeature } from './interfaces';
import {
    AiAnalysisButtonFeature,
    LatestNewsAiAnalysisButtonFeature,
    StockScoreSectionFeature,
} from './features';

async function init() {
    const templateService: TemplateService = TemplateService.getInstance();
    const backendApiService: BackendApiService =
        BackendApiService.getInstance();

    new ContentEventListener(chrome.runtime.onMessage);

    // TossInvestmentHelper 서버가 동작중일 때만 설치합니다.
    const response = await backendApiService.sendHealthCheck();
    if (!response.ok) {
        return;
    }

    RouterObserver.getInstance().initialize();
    DomObserver.getInstance().initialize();

    await templateService.init();

    const features: ContentFeature[] = [
        new AiAnalysisButtonFeature(),
        new StockScoreSectionFeature(),
        new LatestNewsAiAnalysisButtonFeature(),
    ];

    features.forEach((f) => f.start());
}

export const onExecute = async () => {
    await init();
};
