import { context } from '@extension/src/common/context';
import {
    RequestStockAnalysisUseCase,
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

    const requestStockAnalysisUseCase = new RequestStockAnalysisUseCase();
    const sendFavoriteStocksUseCase = new SendFavoriteStocksUseCase();

    requestStockAnalysisUseCase.execute();
    sendFavoriteStocksUseCase.execute();
}

export const onExecute = async () => {
    await init();
};
