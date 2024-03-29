import { UUID } from "@/common/CommonTypes.js"
import { OperationResult } from "@/common/OperationResult.js"
import { TranslatableText } from "@/common/Translatable.js"
import { OrderedComponents } from "@/note/util/OrderedComponents.js"
import { InvalidJsonFormatException, InvalidDataException } from "@/exception/ConversionException.js"
import { NoteElement, NoteElementJson } from "@/note/element/NoteElement.js"
import { EditPath, EditPathNode } from "@/note/util/EditPath.js"
import { AttributeDefinition } from "./attribute/AttributeDefinition.js"
import { AttributeValue, AttributeValueJson } from "./attribute/value/AttributeValue.js"
import { StructureDefinition } from "./StructureDefinition.js"
import { getAllRelatedValuesFunc } from "@/note/section/StructuralSection.js"

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
     * - all value are valid (which is checked when setting the value)
     * @returns true if the element is valid
     */
    validate(): OperationResult {
        for (let [id, value] of this.values) {
            let value_result = value.validate_result
            if (!value_result.valid) {
                return OperationResult.invalidText(
                    TranslatableText.new("structural.attribute.error.invalid_value_for_attr", 
                        {attr_name: value.definition.name})
                    .addElement(value_result.getRawInvalidMessage() as TranslatableText))
            }
        }
        return OperationResult.valid()
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

    static loadFromJson(json: object, definition: StructureDefinition): StructuralElement {
        const result = StructuralElementJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("StructuralElement", result.error.toString())
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
                throw new InvalidDataException("StructuralElement", `Attribute definition not found. ID: ${value_json.definition_id}`)
            }

            let attr_value = AttributeValue.loadFromJson(value_json, attr_def)
            element.setValue(attr_def, attr_value)
        }
        
        return element
    }
}