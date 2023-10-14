import { UUID, ID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/util/ComponentBase"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import { NullAttrTypeException } from "@/note/element/structural/attribute/exception/AttributeException"
import { ValidateResult, ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { z } from "zod"

export const AttributeValueJson = z.object({
    id: z.string(),
    definition_id: z.string(),
    value: z.any()  // this accept null, which actually should not be allowed
}).required()

/**
 * data type + data (value)
 */
export class AttributeValue<T> extends ComponentBase implements EditPathNode {
    private _definition : AttributeDefinition<T>
    private _value : T | null
    private _validate_result : ValidateResult = ValidValidateResult

    constructor(definition: AttributeDefinition<T>, value: T | null = null) {
        super()
        this._definition = definition
        if (value === null){
            value = definition.default_value
        }
        this._value = value
        this.validate()
    }

    get definition(): AttributeDefinition<T> {
        return this._definition
    }

    get definition_id(): UUID {
        return this.definition.id
    }

    get definition_type_str(): string {
        return this.definition.attribute_type?.type || ""
    }

    get value(): T | null {
        return this._value
    }

    set value(value: T) {
        this._value = value
        this.validate()
    }

    validate(): ValidateResult {
        this._validate_result = this.definition.validate(this.value)
        return this._validate_result
    }

    get validate_result(): ValidateResult {
        return this._validate_result
    }

    convertTo<N>(new_attr_def: AttributeDefinition<N>, mode: ID = 0): AttributeValue<N> {
        if (this.definition.attribute_type === null || new_attr_def.attribute_type === null){
            throw new NullAttrTypeException()
        }
        if (this.value === null){
            return new AttributeValue(new_attr_def)
        }
        const new_value: N = this.definition.attribute_type.convertTo(new_attr_def.attribute_type, this.value, mode)
        return new AttributeValue(new_attr_def, new_value)
    }

    getNextEditPathNode(index: string): EditPathNode | undefined {
        return undefined
    }

    stepInEachChildren(edit_path: EditPath, filter_mode?: number): EditPath[] {
        throw new EndOfEditPathError("AttributeValue")
    }

    saveAsJson(): z.infer<typeof AttributeValueJson> {
        return {
            id: this.id,
            definition_id: this.definition_id,
            value: this.value
        }
    }

    static loadFromJson(json: object, attribute_def: AttributeDefinition<any>): AttributeValue<any> | null {
        // check if the json_data match the schema
        const result = AttributeValueJson.safeParse(json)
        if (!result.success) {
            console.error(result.error)
            return null
        }
        const valid_json = result.data

        // check if the attribute definition match
        if (valid_json.definition_id !== attribute_def.id) {
            // throw new Error("Definition id not match")
            return null
        }
        if (result.data.value == null){
            return null
        }

        const value = new AttributeValue(attribute_def, valid_json.value)
        value.id = valid_json.id
        return value
    }
}
