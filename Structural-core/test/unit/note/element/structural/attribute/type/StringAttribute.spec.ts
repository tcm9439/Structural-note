import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { InvalidTypeConversionException, InvalidTypeConversionForDataException } from "@/note/element/structural/attribute/exception/AttributeException"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"

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
        let value = new AttributeValue(definition, "test")
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe("test")
    })
})