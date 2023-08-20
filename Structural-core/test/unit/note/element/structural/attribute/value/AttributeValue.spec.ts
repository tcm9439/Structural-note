import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"

describe('AttributeValue', () => {
	let value: AttributeValue<any>
    let definition: AttributeDefinition<any>

    beforeEach(() => {
        definition = new AttributeDefinition("test", StringAttribute.instance)
        value = new AttributeValue(definition, "Hello World")
    })

    it('constructor', () => {
        expect(value).not.toBeNull()
    })

    it('definition', () => {
        expect(value.definition).toBe(definition)
        expect(value.definition_id).toBe(definition.id)
        expect(value.definition_type_str).toBe("STRING")
    })

    it('value getter setter', () => {
        expect(value.value).toBe("Hello World")
        value.value = "Foo Bar"
        expect(value.value).toBe("Foo Bar")
    })

    it('convertTo', () => {
        const new_definition = new AttributeDefinition("test2", NumberAttribute.instance)
        value.value = "123"
        const new_value = value.convertTo(new_definition)
        expect(new_value.definition).toBe(new_definition)
        expect(new_value.value).toBe(123)
    })
})
