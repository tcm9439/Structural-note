import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { IntegerAttribute, NumberAttribute, DecimalAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"

describe('NumberAttribute', () => {
	it("instance", () => {
        expect(IntegerAttribute.instance).not.toBeNull()
    })

    it("convertToString", () => {
        expect(NumberAttribute.convertToString(109)).toBe("109")
        expect(NumberAttribute.convertToString(109.8)).toBe("110")
        expect(NumberAttribute.convertToString(-9)).toBe("-9")
        expect(NumberAttribute.convertToString(NaN)).toBe("")
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", IntegerAttribute.instance)
        let value = new AttributeValue(definition, 109)
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe(109)
    })
})

describe('DecimalAttribute', () => {
	it("instance", () => {
        expect(DecimalAttribute.instance).not.toBeNull()
    })

    it("convertToString", () => {
        expect(DecimalAttribute.convertToString(109, -1)).toBe("109")
        expect(DecimalAttribute.convertToString(109.888888888, -1)).toBe("109.888888888")
        expect(DecimalAttribute.convertToString(109.8, -1)).toBe("109.8")
        expect(DecimalAttribute.convertToString(-9, -1)).toBe("-9")
        expect(DecimalAttribute.convertToString(NaN, -1)).toBe("")
    })
})
