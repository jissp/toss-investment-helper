import { Nullable } from '@common/types';

export class DocumentService {
    private static instance: DocumentService;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new DocumentService();
        }

        return this.instance;
    }

    public getMainElement(): Nullable<HTMLElement> {
        return document.querySelector<HTMLElement>('div[id="main-content"]');
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

    /**
     * @param elementId
     */
    public removeElement(elementId: string) {
        document.getElementById(elementId)?.remove();
    }
}
