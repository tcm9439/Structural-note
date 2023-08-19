import { OrderedComponents } from "@/note/common/OrderedComponents"
import { UUID } from "@/common/CommonTypes"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { NoteElement } from "@/note/element/NoteElement"

/**
 * A structural element is a part of a structural section.
 * Repeated components.
 */
export class StructuralElement extends NoteElement {
    /** 
     * attribute UUID => value 
     **/
    private _values: Map<UUID, AttributeValue<any>> = new Map()
    private _definition: StructureDefinition

    constructor(definition: StructureDefinition){
        super()
        this._definition = definition
    }

    get values(): Map<UUID, AttributeValue<any>> {
        return this._values
    }

    addValue<T>(attr: AttributeDefinition<T>, value: AttributeValue<T>): void {
        this._values.set(attr.id, value)
    }

    /**
     * Return a list of components according to the order of the attr definition.
     */
    get ordered_values(): AttributeValue<any>[] {
        const order = this._definition.attributes.order
        return OrderedComponents.orderByList(this.values, order)
    }

    /**
     * Validate the element according to the definition
     * @returns true if the element is valid
     */
    validate(): boolean {
        // TODO
        return true
    }
}