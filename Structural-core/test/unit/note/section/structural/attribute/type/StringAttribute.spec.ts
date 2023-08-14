import { describe, it, expect, beforeEach } from "vitest"
import { InvalidTypeConversionException } from "@/note/section/structural/attribute/exception"
import { AttributeDefinition, StringAttribute } from "@/note/section/structural"

describe("StringAttribute", () => {
    it("instance", () => {
        expect(StringAttribute.instance).not.toBeNull()
    })

    it("convertToNumber", () => {
        expect(StringAttribute.instance.convertToNumber("109")).toBe(109)
        expect(StringAttribute.instance.convertToNumber("109.8")).toBe(109.8)
        expect(StringAttribute.instance.convertToNumber("-109.8")).toBe(-109.8)
        expect(() => StringAttribute.instance.convertToNumber("20%")).toThrow(InvalidTypeConversionException)
        expect(() => StringAttribute.instance.convertToNumber("SomeChar")).toThrow(InvalidTypeConversionException)
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", StringAttribute.instance)
        let value = StringAttribute.instance.create(definition, "test")
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe("test")
    })
})