import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath"
import { ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain"

describe('AttributeValue', () => {
	let attr_value: AttributeValue<any>
    let definition: AttributeDefinition<any>

    beforeEach(() => {
        definition = new AttributeDefinition("test", StringAttribute.instance)
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

        expect(attr_value.validate_result.valid).toBeTruthy()
        definition.addConstrain(new RequireConstrain())
        attr_value.value = null
        expect(attr_value.validate_result.valid).toBeFalsy()
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
        expect(value).not.toBeNull()
        expect(value?.id).toBe("ABC1199")
        expect(value?.definition).toBe(definition)
        expect(value?.value).toBe("Hello World")
    })

    it("loadFromJson with invalid json schema", () => {
        let json = { 
            id: "ABC1199", 
            definition_id: definition.id,
        }
        let value = AttributeValue.loadFromJson(json, definition)
        expect(value).toBeNull()
    })

    it("loadFromJson with invalid definition id", () => {
        let json = { 
            id: "ABC1199", 
            definition_id: definition.id + "2",
            value: "Hello World" 
        }
        let value = AttributeValue.loadFromJson(json, definition)
        expect(value).toBeNull()
    })

    it("validate", () => {
        // add a require constrain
        definition.addConstrain(new RequireConstrain())
        expect(attr_value.validate()).toEqual(ValidValidateResult)
        expect(attr_value.validate_result).toEqual(ValidValidateResult)

        attr_value.value = null
        let expected_result = {
            valid: false,
            invalid_message: "This attribute is required"
        }
        expect(attr_value.validate()).toEqual(expected_result)
        expect(attr_value.validate_result).toEqual(expected_result)
    })
})