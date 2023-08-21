import { OrderedComponents } from "@/note/util/OrderedComponents"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"

/**
 * A structure definition is a collection of attribute definitions.
 */
export class StructureDefinition extends ComponentBase implements EditPathNode {
    private _attributes: OrderedComponents<AttributeDefinition<any>> = new OrderedComponents()

    constructor() {
        super()
    }
    
    get attributes(): OrderedComponents<AttributeDefinition<any>> {
        return this._attributes
    }

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return this.attributes.get(index)
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number | undefined): EditPath[] {
        return this.attributes.order.order.map((attribute_id) => {
            return edit_path.clone().append(attribute_id)
        })
    }
}