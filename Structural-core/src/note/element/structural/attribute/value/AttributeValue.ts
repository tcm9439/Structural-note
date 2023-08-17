import { AttributeDefinition } from "@/note/element/structural"

/**
 * data type + data (value)
 */
export class AttributeValue<T> {
    private _definition : AttributeDefinition<T>
    private _value : T

    constructor(definition: AttributeDefinition<T>, value: T) {
        this._definition = definition
        this._value = value
    }

    get definition(): AttributeDefinition<T> {
        return this._definition
    }

    get value(): T {
        return this._value
    }

    set value(value: T) {
        this._value = value
    }
}
