import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"

describe('BooleanAttribute', () => {
    let definition: AttributeDefinition<boolean>
    let value: AttributeValue<boolean>

    beforeEach(() => {
        definition = new AttributeDefinition("test", BooleanAttribute.instance)
        value = new AttributeValue(definition, false)
    })

	it("instance", () => {
        expect(BooleanAttribute.instance).not.toBeNull()
    })

    it("create", () => {
        expect(value.definition).toBe(definition)
        expect(value.value).toBe(false)
    })

    it("convert to string", () => {
        let str_def = new AttributeDefinition("test", StringAttribute.instance)
        let value = new AttributeValue(definition, false)
        expect(value.convertTo(str_def).value).toBe("false")

        value = new AttributeValue(definition, true)
        expect(value.convertTo(str_def).value).toBe("true")
    })
})
