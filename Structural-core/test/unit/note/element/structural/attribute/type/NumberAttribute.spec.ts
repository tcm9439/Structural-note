import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"

describe('NumberAttribute', () => {
	it("instance", () => {
        expect(NumberAttribute.instance).not.toBeNull()
    })

    it("convertToNumber", () => {
        expect(NumberAttribute.instance.convertToString(109)).toBe("109")
        expect(NumberAttribute.instance.convertToString(109.8)).toBe("109.8")
        expect(NumberAttribute.instance.convertToString(-9)).toBe("-9")
        expect(NumberAttribute.instance.convertToString(NaN)).toBe("")
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", NumberAttribute.instance)
        let value = NumberAttribute.instance.create(definition, 109)
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe(109)
    })
})
