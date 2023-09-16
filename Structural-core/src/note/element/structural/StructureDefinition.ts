import { OrderedComponents } from "@/note/util/OrderedComponents"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPath, EditPathNode } from "@/note/util/EditPath"
import { Cloneable, CloneUtil } from "@/note/util/Cloneable"

/**
 * A structure definition is a collection of attribute definitions.
 */
export class StructureDefinition extends ComponentBase implements EditPathNode, Cloneable<StructureDefinition> {
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
        return this.attributes.ordered_components.map((attr_def) => {
            return edit_path.clone().append(attr_def.id, attr_def.name, false)
        })
    }

    clone(): StructureDefinition {
        return CloneUtil.cloneDeepWithCloneable(this)
    }

    cloneFrom(other: StructureDefinition): void {
        // id is not cloned
        this._attributes = CloneUtil.cloneDeepWithCloneable(other._attributes)
    }

    cloneDeepWithCustomizer(): StructureDefinition | undefined {
        return undefined
    }
}