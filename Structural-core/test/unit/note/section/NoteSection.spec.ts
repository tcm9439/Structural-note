import { describe, it, expect, beforeEach } from "vitest"
import { NoteSection } from "@/note/section/NoteSection"
import { TextElement } from "@/note/element/TextElement"
import _ from "lodash"

describe("TextAreaSection", () => {
    let note_section: NoteSection

    beforeEach(() => {
        note_section = new NoteSection("Title 1")
        note_section.elements.add(new TextElement("Content 1"))
        note_section.elements.add(new TextElement("Content 2"))
    })

    it("create", () => {
        expect(note_section).not.toBeUndefined()
    })

    it("get set title", () => {
        let note_section: NoteSection = new NoteSection("Title 1")
        expect(note_section.title).toBe("Title 1")
        note_section.title = "Title 2"
        expect(note_section.title).toBe("Title 2")
    })

    it("get elements", () => {
        expect(note_section.elements.length()).toBe(2)

        let element = note_section.elements.ordered_components[0] as TextElement
        expect(element.content).toBe("Content 1")
    })

    it("getNextEditPathNode", () => {
        let new_ele = new TextElement("Content 3")
        note_section.elements.add(new_ele)
        expect(note_section.getNextEditPathNode(new_ele.id)).toBe(new_ele)
    })

    it("saveAsJson", () => {
        let json = note_section.saveAsJson()
        expect(json.id).toBe(note_section.id)
        expect(json.type).toBe("NoteSection")
        expect(json.title).toBe("Title 1")
        expect(json.elements).not.toBeUndefined()
        expect(json.elements.length).toBe(2)
    })

    it("loadFromJson", () => {
        let json = note_section.saveAsJson()
        let note_section_2 = NoteSection.loadFromJson(json)
        expect(note_section_2).toEqual(note_section)
    })
})
