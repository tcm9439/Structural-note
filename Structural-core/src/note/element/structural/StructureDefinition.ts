import { OrderedComponents, ComponentsOrderJson } from "@/note/util/OrderedComponents"
import { AttributeDefinition, AttributeDefinitionJson } from "@/note/element/structural/attribute/AttributeDefinition"
import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPath, EditPathNode } from "@/note/util/EditPath"
import { Cloneable, CloneUtil } from "@/common/Cloneable"
import { z } from "zod"

export const StructureDefinitionJson = z.object({
    id: z.string(),
    attribute_order: ComponentsOrderJson,
    attributes: z.array(AttributeDefinitionJson)
}).required()

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

    saveAsJson(): z.infer<typeof StructureDefinitionJson> {
        let attributes = this.attributes.ordered_components.flatMap((attr_def) => {
            return attr_def.saveAsJson()
        })

        return {
            id: this.id,
            attribute_order: this.attributes.saveAsJson(),
            attributes: attributes
        }
    }

    static loadFromJson(json: object): StructureDefinition | null {
        const result = StructureDefinitionJson.safeParse(json)
        if (!result.success) {
            console.error("Failed to load StructureDefinition from JSON", json)
            return null
        }
        const valid_json = result.data
        let definition = new StructureDefinition()
        definition.id = valid_json.id

        let loaded_attr = new Map<string, AttributeDefinition<any>>()
        valid_json.attributes.forEach((attr_json: object) => {
            let attr_def = AttributeDefinition.loadFromJson(attr_json)
            if (attr_def !== null) {
                // definition.attributes.add(attr_def)
                loaded_attr.set(attr_def.id, attr_def)
            }
        })

        // add the definitions in the order
        let order = valid_json.attribute_order
        for (let i = 0; i < order.length; i++) {
            let attr_def = loaded_attr.get(order[i])
            if (attr_def === undefined) {
                return null
            }
            definition.attributes.add(attr_def)
        }

        return definition
    }
}