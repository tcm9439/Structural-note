import { UUID, ID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/util/ComponentBase"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { EditPath, EditPathNode, EndOfEditPathError } from "@/note/util/EditPath"
import { NullAttrTypeException } from "@/note/element/structural/attribute/exception/AttributeException"

/**
 * data type + data (value)
 */
export class AttributeValue<T> extends ComponentBase implements EditPathNode {
    private _definition : AttributeDefinition<T>
    private _value : T

    constructor(definition: AttributeDefinition<T>, value: T) {
        super()
        this._definition = definition
        this._value = value
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

    get value(): T {
        return this._value
    }

    set value(value: T) {
        this._value = value
    }

    convertTo<N>(new_attr_def: AttributeDefinition<N>, mode: ID = 0): AttributeValue<N> {
        if (this.definition.attribute_type === null || new_attr_def.attribute_type === null){
            throw new NullAttrTypeException()
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
}
