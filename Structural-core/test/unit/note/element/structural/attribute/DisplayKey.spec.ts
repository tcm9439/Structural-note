import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { ShortStringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute.js"
import { StructureDefinition } from "@/note/element/structural/StructureDefinition.js"
import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { AttributeValue } from "@/index.js"

describe("DisplayKey", () => {
    let definition: StructureDefinition
    let string_attr: AttributeDefinition<string>
    let int_attr: AttributeDefinition<number>
    let element: StructuralElement

    beforeEach(() => {
        definition = new StructureDefinition()
        string_attr = new AttributeDefinition("test str", ShortStringAttribute.instance)  
        int_attr = new AttributeDefinition("test int", IntegerAttribute.instance) 
        element = new StructuralElement(definition) 
        element.values.set(string_attr.id, new AttributeValue(string_attr, "ABC"))
        element.values.set(int_attr.id, new AttributeValue(int_attr, 123))
    })
    
	it("display key: none", () => {
        expect(definition.display_key.getDisplayKey(element)).toBe("")
	})

	it("display key: str", () => {
        definition.display_key.addKey(string_attr)
        expect(definition.display_key.getDisplayKey(element)).toBe("ABC")
	})

	it("display key: str + int", () => {
        definition.display_key.addKey(string_attr)
        definition.display_key.addKey(int_attr)

        expect(definition.display_key.getDisplayKey(element)).toBe("ABC-123")
	})

	it("display key: int + str", () => {
        definition.display_key.separator = "~"
        definition.display_key.addKey(int_attr)
        definition.display_key.addKey(string_attr)

        expect(definition.display_key.getDisplayKey(element)).toBe("123~ABC")
	})
})
