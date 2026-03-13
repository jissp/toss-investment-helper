export function replaceTemplate(template: string, data: object): string {
    Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
            template = template.replaceAll(`{${key}}`, value.toString());
        }
    });

    return template;
}
