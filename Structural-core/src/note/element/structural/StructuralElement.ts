import { UUID } from "@/common/CommonTypes"
import { OrderedComponents } from "@/note/util/OrderedComponents"
import { EditPath, EditPathNode } from "@/note/util/EditPath"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue, AttributeValueJson } from "@/note/element/structural/attribute/value/AttributeValue"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { NoteElement, NoteElementJson } from "@/note/element/NoteElement"
import { z } from "zod"

export const StructuralElementJson = NoteElementJson.extend({
    type: z.literal("StructuralElement"),
    values: z.array(AttributeValueJson),
    definition_id: z.string()
}).required()

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

    get definition(): StructureDefinition {
        return this._definition
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

    getNextEditPathNode(index: UUID): EditPathNode | undefined {
        return this.values.get(index)
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        return this._definition.attributes.ordered_components.map((attr_def) => {
            return edit_path.clone().append(attr_def.id, attr_def.name, false)
        })
    }

    saveAsJson(): z.infer<typeof StructuralElementJson> {
        let values = this.ordered_values.flatMap((value) => {
            return value.saveAsJson()
        })

        return {
            type: "StructuralElement",
            id: this.id,
            definition_id: this._definition.id,
            values: values
        }
    }

    static loadFromJson(json: object, definition: StructureDefinition): StructuralElement | null {
        const result = StructuralElementJson.safeParse(json)
        if (!result.success) {
            console.error(result.error)
            return null
        }
        const valid_json = result.data
        const element = new StructuralElement(definition)
        element.id = valid_json.id
        valid_json.values.forEach((value_json) => {
            // get the corresponding attribute definition for the AttributeValue
            let attr_def = definition.attributes.get(value_json.definition_id)
            if (attr_def === undefined) {
                console.error(`Attribute definition not found: ${value_json.definition_id}`)
                return null
            }
            let attr_value = AttributeValue.loadFromJson(value_json, attr_def)
            if (attr_value === null) {
                console.error("Fail to load Attribute value")
                return null
            }
            element.addValue(attr_def, attr_value)
        })
        
        return element
    }
}