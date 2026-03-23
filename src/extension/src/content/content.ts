import { DomObserver, RouterObserver } from '@extension/src/content/observers';
import { ContentEventListener } from './content-event.listener';
import { BackendApiService } from './services';
import {
    AddAiAnalysisToolbarUseCase,
    BaseUseCaseAbstract,
    OverlayInvestorSectionUseCase,
    RequestLatestNewsAiAnalysisUseCase,
} from './use-cases';

async function init() {
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

    const features: BaseUseCaseAbstract[] = [
        new AddAiAnalysisToolbarUseCase(),
        new OverlayInvestorSectionUseCase(),
        new RequestLatestNewsAiAnalysisUseCase(),
    ];

    features.forEach((f) => f.start());
}

export const onExecute = async () => {
    await init();
};
