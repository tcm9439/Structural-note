import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { InvalidTypeConversionException, InvalidTypeConversionForDataException } from "@/exception/AttributeException.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"

describe("StringAttribute", () => {
    it("instance", () => {
        expect(StringAttribute.instance).not.toBeNull()
    })

    it("convertToInteger", () => {
        expect(StringAttribute.convertToInteger("109")).toBe(109)
        expect(StringAttribute.convertToInteger("109.8")).toBe(110)
        expect(StringAttribute.convertToInteger("109.4")).toBe(109)
        expect(StringAttribute.convertToInteger("-109.8")).toBe(-110)
        expect(() => StringAttribute.convertToInteger("20%")).toThrow(InvalidTypeConversionException)
        expect(() => StringAttribute.convertToInteger("SomeChar")).toThrow(InvalidTypeConversionException)
    })

    it("convertToDecimal", () => {
        expect(StringAttribute.convertToDecimal("109")).toBe(109)
        expect(StringAttribute.convertToDecimal("109.8")).toBe(109.8)
        expect(StringAttribute.convertToDecimal("109.4")).toBe(109.4)
        expect(StringAttribute.convertToDecimal("-109.8")).toBe(-109.8)
        expect(() => StringAttribute.convertToDecimal("20%")).toThrow(InvalidTypeConversionException)
        expect(() => StringAttribute.convertToDecimal("SomeChar")).toThrow(InvalidTypeConversionException)
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", StringAttribute.instance)
        let value = new AttributeValue(definition, "test")
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe("test")
    })
})