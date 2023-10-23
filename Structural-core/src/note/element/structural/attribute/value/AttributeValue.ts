import { UUID, ID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/util/ComponentBase"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import { InvalidTypeConversionForDataException, NullAttrTypeException } from "@/note/element/structural/attribute/exception/AttributeException"
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
    private _definition: AttributeDefinition<T>
    private _value: T | null = null
    private _validate_result: ValidateResult = ValidValidateResult
    private _is_set: boolean = true

    constructor(definition: AttributeDefinition<T>, value: T | null = null) {
        super()
        this._definition = definition
        
        // set the value to default value if it is null & not optional
        if (value === null){
            this.setDefaultValue()
            if (definition.isOptionalAttr()){
                this._is_set = false
            } 
        } else {
            this.value = value
        }
    }

    get is_set(): boolean {
        return this._is_set
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

    set value(value: T | null) {
        if (value === null){
            this.unsetValue()
        } else {
            this._value = value
            this._is_set = true
        }
        this.validate()
    }

    setDefaultValue(){
        if (this._value === null){
            this._value = this.definition.default_value_for_attr
        }
    }

    unsetValue(){
        // still set the default_value as some UI element cannot handle null value
        this._value = this.definition.default_value_for_attr
        this._is_set = false
    }

    validate(): ValidateResult {
        this._validate_result = this.definition.validate(this.value)
        return this._validate_result
    }

    get validate_result(): ValidateResult {
        return this._validate_result
    }

    private set validate_result(value: ValidateResult) {
        this._validate_result = value
    }

    static convertValueForNewAttrDef<O,N>(value: O, old_attr_def: AttributeDefinition<O>, new_attr_def: AttributeDefinition<N>, mode: ID = 0): N | null {
        if (old_attr_def.attribute_type === null || new_attr_def.attribute_type === null){
            throw new NullAttrTypeException()
        }

        try {
            return old_attr_def.attribute_type.convertTo(new_attr_def.attribute_type, value, mode)
        } catch (error) {
            if (error instanceof InvalidTypeConversionForDataException) {
                console.warn(`Failed to convert attribute value with id ${old_attr_def.id} to new type: ${error.message}`)
            }
            return null
        }
    }

    convertTo<N>(new_attr_def: AttributeDefinition<N>, mode: ID = 0): AttributeValue<N> {
        if (this.value === null){
            return new AttributeValue(new_attr_def)
        }
        const conversion_result = AttributeValue.convertValueForNewAttrDef<T, N>(this.value, this.definition, new_attr_def, mode)
        return new AttributeValue(new_attr_def, conversion_result)
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
            console.error("AttrValue loadFromJson: Definition id not match")
            return null
        }
        
        if (result.data.value == null){
            console.error("AttrValue loadFromJson: No value")
            return null
        }

        const value = new AttributeValue(attribute_def, valid_json.value)
        value.id = valid_json.id
        return value
    }
}
