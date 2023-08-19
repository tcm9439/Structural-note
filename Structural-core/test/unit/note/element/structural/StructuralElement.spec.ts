import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { StructuralElement } from "@/note/element/structural/StructuralElement"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition"

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

    it('value getter setter', () => {
        expect(element.values).toBeInstanceOf(Map)

        const str_value = str_attr.create("test")
        element.addValue(str_attr, str_value)
        expect(element.values.get(str_attr.id)).toBe(str_value)
    })

    it('ordered_elements', () => {
        const num_value = num_attr.create(1)
        element.addValue(num_attr, num_value)
        const str_value = str_attr.create("test")
        element.addValue(str_attr, str_value)

        expect(element.ordered_values).toEqual([str_value, num_value])
    })
})
