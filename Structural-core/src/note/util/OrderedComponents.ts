import { UUID } from "@/common/CommonTypes"
import { OrderedList } from "@/common/OrderedList"
import { ComponentBase } from "@/note/util/ComponentBase"
import { z } from "zod"

export const ComponentsOrderJson = z.array(z.string())

export class OrderedComponents<T extends ComponentBase> {
    private _components: Map<UUID, T> = new Map()
    private _order: OrderedList<UUID> = new OrderedList()

    get order(): OrderedList<UUID> {
        return this._order
    }

    get components(): Map<UUID, T> {
        return this._components
    }

    /**
     * Return a list of components according to the order.
     */
    get ordered_components(): T[] {
        return OrderedComponents.orderByList(this._components, this._order)
    }

    public static orderByList<T extends ComponentBase>(components: Map<UUID, T>, order: OrderedList<UUID>): T[] {
        return order.order.map(id => components.get(id) as T)
    }

    saveAsJson(): z.infer<typeof ComponentsOrderJson> {
        return this._order.order
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
    remove(id: UUID): void {
        if (!this._components.has(id)) {
            throw new Error(`Component ${id} does not exist`)
        }
        this._components.delete(id)
        this._order.remove(id)
    }

    get(id: UUID): T | undefined {
        return this._components.get(id)
    }

    has(id: UUID): boolean {
        return this._components.has(id)
    }

    moveUp(component: T): void {
        this._order.moveUp(component.id)
    }

    moveDown(component: T): void {
        this._order.moveDown(component.id)
    }
}