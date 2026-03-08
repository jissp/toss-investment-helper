export enum ComponentType {
    Button = 'button',
}

export interface BaseComponentBuilder {
    build(): Element;

    buildId(id: string): this;

    buildText(text: string): this;

    buildClass(className: string): this;

    buildOnClick(callback: () => void): this;
}
