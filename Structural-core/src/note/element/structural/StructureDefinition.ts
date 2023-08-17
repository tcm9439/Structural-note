import { OrderedComponents } from "@/note/common"
import { AttributeDefinition } from "@/note/element/structural"

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