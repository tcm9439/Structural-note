import { describe, it, expect, beforeEach } from "vitest"
import { NoteSection } from "@/note/section/NoteSection"
import { TextElement } from "@/note/element/TextElement"

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

    it("get title", () => {
        let note_section: NoteSection = new NoteSection("Title 1")
        expect(note_section.title).toBe("Title 1")
    })

    it("get elements", () => {
        expect(note_section.elements.length()).toBe(2)

        let element = note_section.elements.ordered_components[0] as TextElement
        expect(element.content).toBe("Content 1")
    })
})
