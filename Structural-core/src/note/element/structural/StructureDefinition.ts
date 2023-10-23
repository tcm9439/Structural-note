import { OrderedComponents, ComponentsOrderJson } from "@/note/util/OrderedComponents"
import { AttributeDefinition, AttributeDefinitionJson } from "@/note/element/structural/attribute/AttributeDefinition"
import { ComponentBase } from "@/note/util/ComponentBase"
import { EditPath, EditPathNode } from "@/note/util/EditPath"
import { Cloneable, CloneUtil } from "@/common/Cloneable"
import { z } from "zod"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { DisplayKey } from "@/note/element/structural/attribute/DisplayKey"

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
    private _display_key: DisplayKey = new DisplayKey()
    
    get attributes(): OrderedComponents<AttributeDefinition<any>> {
        return this._attributes
    }

    get display_key(): DisplayKey {
        return this._display_key
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
        let this_attr_ids = new Set(this.attributes.order.order)
        let other_attr_ids = new Set(other.attributes.order.order)

        let intersection = new Set<string>([...this_attr_ids].filter(x => other_attr_ids.has(x)))

        // if this & other both has attribute with same id, clone from that attr
        intersection.forEach((attr_id) => {
            let this_attr = this.attributes.get(attr_id)
            let other_attr = other.attributes.get(attr_id)
            if (this_attr !== undefined && other_attr !== undefined) {
                this_attr.cloneFrom(other_attr)
            }
        })

        // if this has an attribute that other does not have, delete that attr
        let this_only = new Set<string>([...this_attr_ids].filter(x => !other_attr_ids.has(x)))
        this_only.forEach((attr_id) => {
            this.attributes.remove(attr_id)
        })

        // if other has an attribute that this does not have, add that attr by making a clone
        let other_only = new Set<string>([...other_attr_ids].filter(x => !this_attr_ids.has(x)))
        other_only.forEach((attr_id) => {
            let other_attr = other.attributes.get(attr_id)
            if (other_attr !== undefined) {
                this.attributes.add(other_attr.clone())
            }
        })

        // copy the order
        let new_order = CloneUtil.cloneDeepWithCloneable(other.attributes.order)
        this.attributes.updateOrder(new_order)
        this._display_key = CloneUtil.cloneDeepWithCloneable(other._display_key)
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

        // load the attribute definitions (in unknown order, just load them first)
        let loaded_attr = new Map<string, AttributeDefinition<any>>()
        valid_json.attributes.forEach((attr_json: object) => {
            let attr_def = AttributeDefinition.loadFromJson(attr_json)
            if (attr_def !== null) {
                loaded_attr.set(attr_def.id, attr_def)
            }
        })

        // add the attribute definitions in the order
        let order = valid_json.attribute_order
        for (let i = 0; i < order.length; i++) {
            let attr_def = loaded_attr.get(order[i])
            if (attr_def === undefined) {
                // the attribute definition is not loaded in the previous step
                // INVALID JSON
                return null
            }
            definition.attributes.add(attr_def)
        }

        return definition
    }

    /**
     * Check if the definition is valid.
     */
    validateDefinition(): ValidateResult {
        // at least one attribute
        if (this.attributes.ordered_components.length === 0) {
            return {
                valid: false,
                invalid_message: "There must be at least one attribute definition."
            }
        }

        // check if the attribute definition is valid
        for (let attr_def of this.attributes.ordered_components) {
            let result = attr_def.validateDefinition()
            if (!result.valid) {
                return result
            }
        }

        // check if all attributes has unique name
        let name_set = new Set<string>()
        for (let attr_def of this.attributes.ordered_components) {
            if (name_set.has(attr_def.name)) {
                return {
                    valid: false,
                    invalid_message: `The attribute name "${attr_def.name}" is not unique.`
                }
            }
            name_set.add(attr_def.name)
        }

        return ValidValidateResult
    }
}