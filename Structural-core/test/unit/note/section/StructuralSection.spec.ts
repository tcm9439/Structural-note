import { describe, it, expect, beforeEach } from "vitest"
import { StructuralSection } from '@/note/section/StructuralSection'
import { EditPath } from "@/note/util/EditPath.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { TextElement } from "@/note/element/TextElement.js"

describe('StructuralSection', () => {
    let section : StructuralSection
    let attr_definition : AttributeDefinition<string>
    let txt_element : TextElement

    beforeEach(() => {
        section = new StructuralSection('title')

        // add definition
        attr_definition = new AttributeDefinition("Str Attr", StringAttribute.instance)
        section.definition.attributes.add(attr_definition)

        // add element
        txt_element = new TextElement("text")
        section.elements.add(txt_element)
    })

	it('constructor', () => {
        expect(section).toBeDefined()
	})

    it('get definition', () => {
        expect(section.definition).toBeDefined()
    })

    it("getNextEditPathNode", () => {
        expect(section.getNextEditPathNode(section.definition.id)).toBe(section.definition)
        expect(section.getNextEditPathNode("NA")).toBeUndefined()
    })

    it("stepInEachChildren DEFINITION_FILTER_MODE", () => {
        let edit_path = section.stepInEachChildren(new EditPath(), StructuralSection.DEFINITION_FILTER_MODE)
        expect(edit_path.length).toBe(1)
        expect(edit_path[0].getLastStep()).toBe(section.definition.id)
    })

    it("stepInEachChildren ELEMENT_FILTER_MODE", () => {
        let edit_path = section.stepInEachChildren(new EditPath(), StructuralSection.ELEMENT_FILTER_MODE)
        expect(edit_path.length).toBe(1)
        expect(edit_path[0].getLastStep()).toBe(txt_element.id)
    })

    it("stepInEachChildren no mode specified", () => {
        let edit_path = section.stepInEachChildren(new EditPath())
        expect(edit_path.length).toBe(1)
        expect(edit_path[0].getLastStep()).toBe(txt_element.id)
    })

    it("saveAsJson", () => {
        let json = section.saveAsJson()
        expect(json.id).toBe(section.id)
        expect(json.type).toBe("StructuralSection")
        expect(json.definition).not.toBeUndefined()
        expect(json.title).toBe("title")
        expect(json.elements.length).toBe(1)
    })

    it("loadFromJson", () => {
        let json = section.saveAsJson()
        let section_2 = StructuralSection.loadFromJson(json)
        expect(section_2).toEqual(section)
    })
})
