import { ButtonBuilder } from './builders';
import { BaseComponentBuilder, ComponentType } from './component.types';

export class ComponentFactory {
    public create(type: ComponentType): BaseComponentBuilder {
        switch (type) {
            case ComponentType.Button:
                return new ButtonBuilder();
            default:
                throw new Error(`Unsupported component type: ${type}`);
        }
    }
}
