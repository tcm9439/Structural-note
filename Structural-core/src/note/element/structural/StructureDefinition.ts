import { OrderedComponents } from "@/note/util/OrderedComponents"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"

/**
 * A structure definition is a collection of attribute definitions.
 */
export class StructureDefinition {
    private _attributes: OrderedComponents<AttributeDefinition<any>> = new OrderedComponents()

    constructor() {}

    get attributes(): OrderedComponents<AttributeDefinition<any>> {
        return this._attributes
    }
}