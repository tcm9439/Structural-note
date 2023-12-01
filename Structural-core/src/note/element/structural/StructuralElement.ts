import { UUID } from "@/common/CommonTypes"
import { OrderedComponents } from "@/note/util/OrderedComponents"
import { EditPath, EditPathNode } from "@/note/util/EditPath"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue, AttributeValueJson } from "@/note/element/structural/attribute/value/AttributeValue"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { NoteElement, NoteElementJson } from "@/note/element/NoteElement"
import { ValidOperationResult, OperationResult } from "@/common/OperationResult"
import { z } from "zod"

export const StructuralElementJson = NoteElementJson.extend({
    type: z.literal("StructuralElement"),
    values: z.array(AttributeValueJson.nullable()),
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

        // initialize the values
        for (let [attr_id, attr_def] of definition.attributes.components) {
            this._values.set(attr_id, new AttributeValue(attr_def))
        }
    }

    get values(): Map<UUID, AttributeValue<any>> {
        return this._values
    }

    setValue<T>(attr: AttributeDefinition<T>, value: AttributeValue<T>): void {
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
     * the element is valid if
     * - all value are valid
     * // - and all required attribute are present (now moved to RequireConstrain)
     * @returns true if the element is valid
     */
    validate(): OperationResult {
        for (let [id, value] of this.values) {
            let value_result = value.validate_result
            if (!value_result.valid) {
                value_result.invalid_message = `Invalid value for attribute "${value.definition.name}": ${value_result.invalid_message}`
                return value_result
            }
        }
        return ValidOperationResult
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
            if (value === undefined) {
                return null
            }
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

        for (let value_json of valid_json.values) {
            if (value_json === null) {
                // the value is not present
                continue
            }

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
            element.setValue(attr_def, attr_value)
        }
        
        return element
    }
}