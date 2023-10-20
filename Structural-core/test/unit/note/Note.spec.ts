import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { Note } from '@/note/Note'
import { NoteSection } from '@/note/section/NoteSection'
import { StructuralSection } from '@/note/section/StructuralSection'
import { EditPath } from "@/note/util/EditPath"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute"
import { TextElement } from "@/note/element/TextElement"
import { StructuralElement } from "@/note/element/structural/StructuralElement"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"

describe('Note', () => {
    let note: Note 
    beforeEach(() => {
        note = new Note("Title 1")
    })

	it('constructor', () => {
        expect(note).not.toBeUndefined()
	})

    it('title', () => {
        expect(note.title).toBe("Title 1")
        note.title = "Title 2"
        expect(note.title).toBe("Title 2")
    })

    it('get sections', () => {
        expect(note.sections).not.toBeUndefined()
        expect(note.sections.length()).toBe(0)

        let section1 = new NoteSection("Section 1")
        note.sections.add(section1)
        expect(note.sections.length()).toBe(1)
        expect(note.sections.get(section1.id)).toBe(section1)
    })  

    it("getNextEditPathNode", () => {
        let section1 = new NoteSection("Section 1")
        note.sections.add(section1)
        expect(note.getNextEditPathNode(section1.id)).toBe(section1)
    })

    it("stepInEachChildren", () => {
        let section1 = new NoteSection("Section 1")
        note.sections.add(section1)
        let section2 = new NoteSection("Section 2")
        note.sections.add(section2)
        let section3 = new NoteSection("Section 3")
        note.sections.add(section3)

        let edit_path = note.stepInEachChildren(new EditPath())
        expect(edit_path.length).toBe(3)
        expect(edit_path[0].getLastStep()).toBe(section1.id)
        expect(edit_path[1].getLastStep()).toBe(section2.id)
        expect(edit_path[2].getLastStep()).toBe(section3.id)
    })

    it("saveAsJson", () => {
        let section1 = new NoteSection("Section 1")
        note.sections.add(section1)
        let section2 = new NoteSection("Section 2")
        note.sections.add(section2)
        let section3 = new NoteSection("Section 3")
        note.sections.add(section3)

        let json = note.saveAsJson()
        expect(json.id).toBe(note.id)
        expect(json.title).toBe("Title 1")
        expect(json.sections).not.toBeUndefined()
        expect(json.sections.length).toBe(3)
    })
})


describe("Save & load Note", () => {
    let note: Note
    beforeAll(() => {
        // create a complex note
        note = new Note("Save and Load Test")
        let section1 = new NoteSection("Section 1")
        note.sections.add(section1)
        let section2 = new StructuralSection("Section 2 - Structural")
        note.sections.add(section2)

        // add definition
        let definition = section2.definition
        let str_attr = new AttributeDefinition("Str Attr", StringAttribute.instance)
        definition.attributes.add(str_attr)
        let bool_attr = new AttributeDefinition("Bool Attr", BooleanAttribute.instance)
        definition.attributes.add(bool_attr)

        // add elements
        let element1 = new TextElement("Element 1")
        element1.content = "Content 1"
        section1.elements.add(element1)

        let element2 = new StructuralElement(section2.definition)
        section2.elements.add(element2)
        element2.setValue(str_attr, new AttributeValue(str_attr, "test value 1"))
        element2.setValue(bool_attr, new AttributeValue(bool_attr, true))

        let element3 = new StructuralElement(section2.definition)
        section2.elements.add(element3)
        element3.setValue(str_attr, new AttributeValue(str_attr, "test value 2"))
        element3.setValue(bool_attr, new AttributeValue(bool_attr, false))
    })

    it("save and load", () => {
        let json = note.saveAsJson()
        let loaded_note = Note.loadFromJson(json)
        expect(loaded_note).toEqual(note)
    })
})