import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { IntegerAttribute, NumberAttribute, DecimalAttribute } from "@/note/element/structural/attribute/type/NumberAttribute.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"

describe('NumberAttribute', () => {
	it("instance", () => {
        expect(IntegerAttribute.instance).not.toBeNull()
    })

    it("convertToString", () => {
        let param = {precision: -1}
        expect(NumberAttribute.convertToString(109, param)).toBe("109")
        expect(NumberAttribute.convertToString(109.888888888, param)).toBe("109.888888888")
        expect(NumberAttribute.convertToString(109.8, param)).toBe("109.8")
        expect(NumberAttribute.convertToString(-9, param)).toBe("-9")
        expect(NumberAttribute.convertToString(NaN, param)).toBe("")

        param = {precision: 2}
        expect(NumberAttribute.convertToString(109, param)).toBe("109.00")
        expect(NumberAttribute.convertToString(109.888888888, param)).toBe("109.89")
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
})
