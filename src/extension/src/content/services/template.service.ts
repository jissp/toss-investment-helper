export class TemplateService {
    private readonly templatePaths: string[] = [
        'src/content/templates/investor-score.section.html',
        'src/content/templates/request-stock-ai-analysis.button.html',
        'src/content/templates/send-favorite-stocks.button.html',
    ];

    private readonly loadedTemplates: Record<string, Element> = {};

    private readonly parser = new DOMParser();

    public async init() {
        await Promise.all(
            this.templatePaths.map(async (templatePath) => {
                this.loadedTemplates[templatePath] =
                    await this.loadTemplate(templatePath);
            }),
        );
    }

    public async loadTemplate(resourcePath: string) {
        const response = await fetch(chrome.runtime.getURL(resourcePath));

        const htmlText = await response.text();

        return this.parseTemplate(htmlText);
    }

    public getTemplate(resourcePath: string) {
        return this.loadedTemplates[resourcePath].cloneNode(true);
    }

    private parseTemplate(template: string) {
        const doc = this.parser.parseFromString(template, 'text/html');

        return doc.body.firstElementChild!;
    }
}
