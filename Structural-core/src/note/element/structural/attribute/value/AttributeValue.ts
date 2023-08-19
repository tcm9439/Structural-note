import { UUID } from "@/common/CommonTypes"
import { ComponentBase } from "@/note/common/ComponentBase"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"

/**
 * data type + data (value)
 */
export class AttributeValue<T> extends ComponentBase {
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
        return this._definition.id
    }

    get definition_type(): string {
        return this._definition.attributeType.type
    }

    get value(): T {
        return this._value
    }

    set value(value: T) {
        this._value = value
    }
}
