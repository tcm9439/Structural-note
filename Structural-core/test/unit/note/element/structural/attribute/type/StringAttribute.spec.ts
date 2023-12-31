import { describe, it, expect, beforeAll } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { StringAttribute, ShortStringAttribute, LongStringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { InvalidTypeConversionException, ModuleInit } from "@/index.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"

describe("StringAttribute", () => {
    beforeAll(async () => {
        await ModuleInit.init()
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
})

describe("ShortStringAttribute", () => {
    beforeAll(async () => {
        await ModuleInit.init()
    })

    it("instance", () => {
        expect(ShortStringAttribute.instance).not.toBeNull()
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", ShortStringAttribute.instance)
        let value = new AttributeValue(definition, "test")
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe("test")
    })
})

describe("LongStringAttribute", () => {
    beforeAll(async () => {
        await ModuleInit.init()
    })

    it("instance", () => {
        expect(LongStringAttribute.instance).not.toBeNull()
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", LongStringAttribute.instance)
        let value = new AttributeValue(definition, "test")
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe("test")
    })

    it("convertTo ShortString", () => {
        let long_string_definition = new AttributeDefinition("test long", LongStringAttribute.instance)
        let short_string_definition = new AttributeDefinition("test short", ShortStringAttribute.instance)
        let value = new AttributeValue(long_string_definition, "test")
        expect(value.convertTo(short_string_definition).value).toBe("test")
    })
})