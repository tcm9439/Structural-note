import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { StructuralElement } from "@/note/element/structural/StructuralElement"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { EditPath } from "@/note/util/EditPath"

describe('StructuralElement', () => {
    let element: StructuralElement
    let definition: StructureDefinition
    let str_attr: AttributeDefinition<string>
    let num_attr: AttributeDefinition<number>

    beforeEach(() => {
        definition = new StructureDefinition()
        str_attr = new AttributeDefinition("str", StringAttribute.instance)
        definition.attributes.add(str_attr)
        num_attr = new AttributeDefinition("num", NumberAttribute.instance)
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

    it('ordered_elements', () => {
        const num_value = new AttributeValue(num_attr, 1)
        element.addValue(num_attr, num_value)
        const str_value = new AttributeValue(str_attr, "test")
        element.addValue(str_attr, str_value)

        expect(element.ordered_values).toEqual([str_value, num_value])
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
})
