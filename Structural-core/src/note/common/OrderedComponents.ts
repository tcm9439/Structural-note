import { UUID } from "crypto"
import { OrderedList } from "@/common/OrderedList"
import { ComponentBase } from "@/note/common"

export class OrderedComponents<T extends ComponentBase> {
    private _components: Map<UUID, T> = new Map()
    private _order: OrderedList<UUID> = new OrderedList()

    get order(): OrderedList<UUID> {
        return this._order
    }

    get components(): Map<UUID, T> {
        return this._components
    }

    length(): number {
        return this._order.length()
    }

    /**
     * Add a component to the end of the list.
     * If the component is already in the list, raise error..
     */
    add(component: T): void {
        const id = component.id
        if (this._components.has(id)) {
            throw new Error(`Component ${id} already exists`)
        }
        this._components.set(id, component)
        this._order.add(id)
    }

    /**
     * Remove a component from the list.
     * If the component is not in the list, raise error.
     */
    remove(component: T): void {
        const id = component.id
        if (!this._components.has(id)) {
            throw new Error(`Component ${id} does not exist`)
        }
        this._components.delete(id)
        this._order.remove(id)
    }

    get(id: UUID): T | undefined {
        return this._components.get(id)
    }

    moveUp(component: T): void {
        this._order.moveUp(component.id)
    }

    moveDown(component: T): void {
        this._order.moveDown(component.id)
    }
}