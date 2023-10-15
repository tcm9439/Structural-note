import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { StructuralElement } from "@/note/element/structural/StructuralElement"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { EditPath } from "@/note/util/EditPath"
import { MaxConstrain } from "@/note/element/structural/attribute/constrain/MaxConstrain"

describe('StructuralElement', () => {
    let element: StructuralElement
    let definition: StructureDefinition
    let str_attr: AttributeDefinition<string>
    let num_attr: AttributeDefinition<number>

    beforeEach(() => {
        definition = new StructureDefinition()
        str_attr = new AttributeDefinition("str", StringAttribute.instance)
        definition.attributes.add(str_attr)
        num_attr = new AttributeDefinition("num", IntegerAttribute.instance)
        definition.attributes.add(num_attr)

        element = new StructuralElement(definition)
    })

	it('constructor', () => {
        expect(element).not.toBeNull()
    })

    it('get set values', () => {
        expect(element.values).toBeInstanceOf(Map)
        const str_value = new AttributeValue(str_attr, "test")
        element.addValue(str_attr, str_value)
        expect(element.values.get(str_attr.id)).toBe(str_value)
    })

    it('ordered_values', () => {
        const num_value = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, num_value)
        const str_value = new AttributeValue(str_attr, "test")
        element.addValue(str_attr, str_value)

        expect(element.ordered_values).toEqual([str_value, num_value])
    })

    it("validate: valid", () => {
        num_attr.addConstrain(new MinConstrain(10))
        const num_value = new AttributeValue(num_attr, 20)
        element.addValue(num_attr, num_value)

        let result = element.validate()
        expect(result).toBe(ValidValidateResult)
    })

    it("validate: not passing the constrain", () => {
        num_attr.addConstrain(new MinConstrain(100))
        const num_value = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, num_value)

        let result = element.validate()
        expect(result.valid).toBe(false)
        expect(result.invalid_message).toBe(`Invalid value for attribute "num": The value is smaller than the minimum`)
    })

    it("validate: only passing some of the constrains", () => {
        num_attr.addConstrain(new MinConstrain(100))
        num_attr.addConstrain(new MaxConstrain(110))
        const num_value = new AttributeValue(num_attr, 200)
        element.addValue(num_attr, num_value)
        
        let result = element.validate()
        expect(result.valid).toBe(false)
        expect(result.invalid_message).toBe(`Invalid value for attribute "num": The value is larger than the maximum`)
    })

    it("getNextEditPathNode", () => {
        const new_value = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, new_value)
        expect(element.getNextEditPathNode(num_attr.id)).toBe(new_value)
    })

    it("stepInEachChildren", () => {
        let value2 = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, value2)
        let value = new AttributeValue(str_attr, "test")
        element.addValue(str_attr, value)

        let edit_path = (new EditPath()).append(element.id)
        let edit_paths = element.stepInEachChildren(edit_path)
        expect(edit_paths.length).toBe(2)
        expect(edit_paths[0].getLastStep()).toBe(str_attr.id)
        expect(edit_paths[1].getLastStep()).toBe(num_attr.id)
    })

    it("saveAsJson", () => {
        let value2 = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, value2)
        let value = new AttributeValue(str_attr, "test")
        element.addValue(str_attr, value)

        let json = element.saveAsJson()
        expect(json).toEqual({
            type: "StructuralElement",
            id: element.id,
            definition_id: definition.id,
            values: [
                {
                    id: value.id,
                    definition_id: str_attr.id,
                    value: "test"
                },
                {
                    id: value2.id,
                    definition_id: num_attr.id,
                    value: 1
                }
            ]
        })
    })

    it("loadFromJson", () => {
        let value2 = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, value2)
        let value = new AttributeValue(str_attr, "test")
        element.addValue(str_attr, value)
        let json = element.saveAsJson()
        let new_element = StructuralElement.loadFromJson(json, definition)
        expect(new_element).not.toBeNull()
        expect(new_element?.id).toBe(element.id)
        expect(new_element?.definition).toBe(definition)
        expect(new_element?.values.size).toBe(2)
        expect(new_element?.values.get(str_attr.id)).toEqual(value)
        expect(new_element?.values.get(num_attr.id)).toEqual(value2)
    })

    it("loadFromJson: invalid json data type", () => {
        let json = { "abc": 123 }
        let new_element = StructuralElement.loadFromJson(json, definition)
        expect(new_element).toBeNull()
    })

    it("loadFromJson: invalid attr definition id", () => {
        let value2 = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, value2)
        let value = new AttributeValue(str_attr, "test")
        element.addValue(str_attr, value)
        let json = element.saveAsJson()

        definition.attributes.remove(str_attr.id)
        let new_element = StructuralElement.loadFromJson(json, definition)
        expect(new_element).toBeNull()
    })

    it("loadFromJson: one of the attr value is undefined", () => {
        let value2 = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, value2)
        let json = element.saveAsJson()
        expect(json.values[0]).toBeNull()

        let new_element = StructuralElement.loadFromJson(json, definition)
        expect(new_element).toEqual(element)
    })
})
