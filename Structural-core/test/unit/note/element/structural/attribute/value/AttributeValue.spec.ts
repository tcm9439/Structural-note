import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { ShortStringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute.js"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath.js"
import { ValidOperationResult } from "@/common/OperationResult.js"
import { RequireConstraint } from "@/note/element/structural/attribute/constraint/RequireConstraint.js"
import { ModuleInit, InvalidDataException, UniqueConstraint } from "@/index.js"

describe('AttributeValue', () => {
	let attr_value: AttributeValue<any>
    let definition: AttributeDefinition<any>
    let related_values: any[]

    function getValues(id: string){
        return related_values
    }

    beforeAll(async () => {
        await ModuleInit.init()
    })

    beforeEach(() => {
        definition = new AttributeDefinition("test", ShortStringAttribute.instance, "test desc", getValues.bind(this))
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

        definition.addConstraint(new RequireConstraint())
        expect(attr_value.validate_result.valid).toBeTruthy()
        attr_value.value = null
        expect(attr_value.validate_result.valid).toBeFalsy()
    })

    it("get set value", () => {
        expect(attr_value.value).toBe("Hello World")
        expect(attr_value.is_set).toBeTruthy()
        attr_value.value = "Foo Bar"
        expect(attr_value.is_set).toBeTruthy()
        expect(attr_value.value).toBe("Foo Bar")
        
        expect(attr_value.validate_result.valid).toBeTruthy()
        definition.addConstraint(new RequireConstraint())
        attr_value.value = null
        expect(attr_value.is_set).toBeFalsy()
        expect(attr_value.validate_result.valid).toBeFalsy()
    })

    it("is_set: has require constraint = true", () => {
        // => set to attr default
        definition.addConstraint(new RequireConstraint())

        let attr_value_null = new AttributeValue(definition)
        expect(attr_value_null.is_set).toBeTruthy()
        expect(attr_value_null.value).toBe("")

        let attr_value_set = new AttributeValue(definition, "Hello World")
        expect(attr_value_set.is_set).toBeTruthy()
        expect(attr_value_set.value).toBe("Hello World")
    })

    it("is_set: has require constraint = false", () => {
        let attr_value_null = new AttributeValue(definition)
        expect(attr_value_null.is_set).toBeFalsy()
        expect(attr_value_null.value).not.toBe(null)

        let attr_value_set = new AttributeValue(definition, "Hello World")
        expect(attr_value_set.is_set).toBeTruthy()
        expect(attr_value_set.value).toBe("Hello World")
    })

    it('convertTo', () => {
        const new_definition = new AttributeDefinition("test2", IntegerAttribute.instance)
        attr_value.value = "123"
        const new_value = attr_value.convertTo(new_definition)
        expect(new_value.definition).toBe(new_definition)
        expect(new_value.value).toBe(123)
    })

    it("getNextEditPathNode", () => {
        expect(attr_value.getNextEditPathNode("")).toBeUndefined()
    })

    it("stepInEachChildren", () => {
        expect(() => { attr_value.stepInEachChildren(new EditPath()) }).toThrow(EndOfEditPathError)
    })

    it("saveAsJson", () => {
        expect(attr_value.saveAsJson()).toEqual({
            id: attr_value.id,
            definition_id: definition.id,
            value: "Hello World"
        })
    })

    it("loadFromJson", () => {
        let json = { 
            id: "ABC1199", 
            definition_id: definition.id,
            value: "Hello World" 
        }
        let value = AttributeValue.loadFromJson(json, definition)
        expect(value.id).toBe("ABC1199")
        expect(value.definition).toBe(definition)
        expect(value.value).toBe("Hello World")
    })

    it("loadFromJson with null value", () => {
        definition.addConstraint(new RequireConstraint())
        let json = { 
            id: "ABC1199", 
            definition_id: definition.id,
        }
        expect(() => {
            AttributeValue.loadFromJson(json, definition)
        }).toThrowError(InvalidDataException)
    })

    it("loadFromJson with invalid definition id", () => {
        let json = { 
            id: "ABC1199", 
            definition_id: definition.id + "2",
            value: "Hello World" 
        }
        expect(() => {
            AttributeValue.loadFromJson(json, definition)
        }).toThrowError(InvalidDataException)
    })

    it("validate", () => {
        related_values = [attr_value.value, "aa124", "bb345"]
        // add a require constraint
        definition.addConstraint(new RequireConstraint())
        expect(attr_value.validate()).toEqual(ValidOperationResult)
        expect(attr_value.validate_result).toEqual(ValidOperationResult)

        attr_value.value = null
        let validate_result = attr_value.validate()
        expect(validate_result).toEqual(attr_value.validate_result)
        expect(attr_value.validate_result.valid).toEqual(false)
        expect(attr_value.validate_result.invalid_message).toEqual('This attribute is required')
    })

    it("validate - validateValueGroup (unique)", () => {
        related_values = [attr_value.value, "aa124", "bb345"]
        expect(definition.getGetAllRelatedValuesFunc()("")).toEqual(related_values)
        // add a unique constraint
        definition.addConstraint(new UniqueConstraint())
        expect(attr_value.validate()).toEqual(ValidOperationResult)
        
        related_values = [attr_value.value, "aa124", "bb345", attr_value.value]
        expect(definition.getGetAllRelatedValuesFunc()("")).toEqual(related_values)
        let validate_result = attr_value.validate()
        expect(validate_result).toEqual(attr_value.validate_result)
        expect(attr_value.validate_result.valid).toEqual(false)
    })
})
