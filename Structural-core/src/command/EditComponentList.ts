import { ICommand } from "@/command/ICommand.js"
import { ComponentBase } from "@/note/util/ComponentBase.js"
import { OrderedComponents } from "@/note/util/OrderedComponents.js"

export class AddComponentsCommand implements ICommand {
    private _add_func: () => void
    private _remove_func: () => void

    constructor(new_component: ComponentBase, components: OrderedComponents<ComponentBase>, add_component_func: () => void) {
        this._add_func = add_component_func
        this._remove_func = () => {
            components.remove(new_component.id)
        }
    }

    execute(): void {
        this._add_func()
    }

    undo(): void {
        this._remove_func()
    }
}

export class RemoveComponentsCommand implements ICommand {
    private _add_func: () => void
    private _remove_func: () => void

    constructor(component: ComponentBase, components: OrderedComponents<ComponentBase>) {
        this._remove_func = () => {
            components.remove(component.id)
        }
        let component_pos = components.getPosition(component.id)
        this._add_func = () => {
            components.addAtPosition(component_pos, component)
        }
    }

    static newById(component_id: string, components: OrderedComponents<ComponentBase>): RemoveComponentsCommand {
        const component = components.get(component_id)
        if (component) {
            return new RemoveComponentsCommand(component, components)
        } else {
            throw new Error(`Component ${component_id} not found`)
        }
    }

    execute(): void {
        this._remove_func()
    }
    
    undo(): void {
        this._add_func()
    }
}