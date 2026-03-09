import { Nullable } from '@common/types';

export class DocumentService {
    constructor() {}

    public getMainElement(): Nullable<HTMLElement> {
        return document.querySelector('div[id="main-content"]')!;
    }

    /**
     *
     */
    public getTsLnb(): HTMLElement | null {
        const main = this.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector('[id="ts-lnb"]')?.parentElement || null;
    }
}
