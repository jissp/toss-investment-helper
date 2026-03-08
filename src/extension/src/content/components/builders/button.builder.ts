import { BaseComponentBuilder } from '../component.types';

export class ButtonBuilder implements BaseComponentBuilder {
    private readonly element: HTMLElement;

    constructor() {
        this.element = document.createElement('button');
    }

    build(): Element {
        return this.element;
    }

    buildClass(className: string): this {
        this.element.className = className;

        return this;
    }

    buildId(id: string): this {
        this.element.id = id;

        return this;
    }

    buildOnClick(callback: () => void): this {
        this.element.onclick = callback;

        return this;
    }

    buildText(text: string): this {
        this.element.innerText = text;

        return this;
    }
}
