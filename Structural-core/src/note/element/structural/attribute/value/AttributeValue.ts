import { LoggerManager } from "@/common/Logger.js"
import { UUID, ID } from "@/common/CommonTypes.js"
import { OperationResult } from "@/common/OperationResult.js"
import { ComponentBase } from "@/note/util/ComponentBase.js"
import { AttributeDefinition } from "../AttributeDefinition.js"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath.js"
import { InvalidJsonFormatException, InvalidDataException } from "@/exception/ConversionException.js"
import { InvalidTypeConversionForDataException, NullAttrTypeException } from "@/exception/AttributeException.js"
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
    private _validate_result: OperationResult = OperationResult.valid()
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

    validate(): OperationResult {
        this._validate_result = this.definition.validate(this.value)
        if (this._validate_result.valid){
            // basic validation passed, check if the value is valid w.r.t. the related values
            if (this.definition.getIsRelatedToOtherValues()){
                this._validate_result = this.definition.validateValueGroup()
            }
        }
        return this._validate_result
    }

    get validate_result(): OperationResult {
        return this._validate_result
    }

    private set validate_result(value: OperationResult) {
        this._validate_result = value
    }

    static convertValueForNewAttrDef<O,N>(value: O | null, old_attr_def: AttributeDefinition<O>, new_attr_def: AttributeDefinition<N>, mode: ID = 0): N | null {
        if (value === null){
            return null
        }

        if (old_attr_def.attribute_type === null || new_attr_def.attribute_type === null){
            throw new NullAttrTypeException()
        }

        try {
            return old_attr_def.attribute_type.convertTo(new_attr_def.attribute_type, value, mode)
        } catch (error) {
            if (error instanceof InvalidTypeConversionForDataException) {
                LoggerManager.logger.warn(`Failed to convert attribute value with id ${old_attr_def.id} to new type: ${error.message}`)
            }
            return null
        }
    }

    convertTo<N>(new_attr_def: AttributeDefinition<N>, mode: ID = 0): AttributeValue<N> {
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

    static loadFromJson(json: object, attribute_def: AttributeDefinition<any>): AttributeValue<any> {
        // check if the json_data match the schema
        const result = AttributeValueJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("AttributeValue", result.error.toString())
        }
        const valid_json = result.data

        // check if the attribute definition match
        if (valid_json.definition_id !== attribute_def.id) {
            throw new InvalidDataException("AttributeValue", `Definition id not match. Expected: ${attribute_def.id}, Actual: ${valid_json.definition_id}`)
        }
        
        // the value can be null iff it is optional
        if (result.data.value == null && !attribute_def.isOptionalAttr()){
            throw new InvalidDataException("AttributeValue", "Value cannot be null")
        }

        const value = new AttributeValue(attribute_def, valid_json.value)
        value.id = valid_json.id
        return value
    }
}
