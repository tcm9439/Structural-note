import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"

describe('NumberAttribute', () => {
	it("instance", () => {
        expect(IntegerAttribute.instance).not.toBeNull()
    })

    it("convertToNumber", () => {
        expect(IntegerAttribute.instance.convertToString(109)).toBe("109")
        expect(IntegerAttribute.instance.convertToString(109.8)).toBe("109.8")
        expect(IntegerAttribute.instance.convertToString(-9)).toBe("-9")
        expect(IntegerAttribute.instance.convertToString(NaN)).toBe("")
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", IntegerAttribute.instance)
        let value = new AttributeValue(definition, 109)
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe(109)
    })
})
