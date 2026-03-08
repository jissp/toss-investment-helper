export class StorageHelper {
    public async set(key: string, value: unknown) {
        return chrome.storage.local.set({ [key]: value });
    }

    public async get(key: string) {
        const object = await chrome.storage.local.get(key);

        return object['key'];
    }

    public async setTossInvestmentHelperEnable(status: boolean) {
        await this.set('tossInvestmentHelperEnable', status);
    }

    public async isTossInvestmentHelperEnable() {
        const status = await this.get('tossInvestmentHelperEnable');

        return status === true;
    }
}
