import { context } from '@extension/src/common/context';
import {
    RequestStockAiAnalysisUseCase,
    ShowStockScoreSectionUseCase,
    SendFavoriteStocksUseCase,
} from '@extension/src/content/use-cases';
import { ContentEventListener } from './content-event.listener';

async function init() {
    new ContentEventListener(chrome.runtime.onMessage);

    // TossInvestmentHelper 서버가 동작중일 때만 설치합니다.
    const response = await context.backendApi.sendHealthCheck();
    if (!response.ok) {
        return;
    }

    await context.templateService.init();

    const requestStockAnalysisUseCase = new RequestStockAiAnalysisUseCase();
    const requestStockScoreAnalysisUseCase =
        new ShowStockScoreSectionUseCase();
    const sendFavoriteStocksUseCase = new SendFavoriteStocksUseCase();

    requestStockAnalysisUseCase.execute();
    requestStockScoreAnalysisUseCase.execute();
    sendFavoriteStocksUseCase.execute();
}

export const onExecute = async () => {
    await init();
};
