import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath"

describe('AttributeValue', () => {
	let attr_value: AttributeValue<any>
    let definition: AttributeDefinition<any>

    beforeEach(() => {
        definition = new AttributeDefinition("test", StringAttribute.instance)
        attr_value = new AttributeValue(definition, "Hello World")
    })

    it('constructor', () => {
        expect(attr_value).not.toBeNull()
    })

    it('definition', () => {
        expect(attr_value.definition).toBe(definition)
        expect(attr_value.definition_id).toBe(definition.id)
        expect(attr_value.definition_type_str).toBe("STRING")
    })

    it("get set value", () => {
        expect(attr_value.value).toBe("Hello World")
        attr_value.value = "Foo Bar"
        expect(attr_value.value).toBe("Foo Bar")
    })

    it('convertTo', () => {
        const new_definition = new AttributeDefinition("test2", NumberAttribute.instance)
        attr_value.value = "123"
        const new_value = attr_value.convertTo(new_definition)
        expect(new_value.definition).toBe(new_definition)
        expect(new_value.value).toBe(123)
    })

    it("getNextEditPathNode", () => {
        expect(() => { attr_value.getNextEditPathNode("") }).toThrow(EndOfEditPathError)
    })

    it("stepInEachChildren", () => {
        expect(() => { attr_value.stepInEachChildren(new EditPath()) }).toThrow(EndOfEditPathError)
    })
})
