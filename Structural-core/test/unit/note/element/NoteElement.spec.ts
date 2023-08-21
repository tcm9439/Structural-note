import { describe, it, expect, beforeEach } from "vitest"
import { NoteElement } from "@/note/element/NoteElement"
import { TextElement } from "@/note/element/TextElement"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath"

describe("NoteElement", () => {
    it("constructor", () => {
        let element = new TextElement()
        expect(element).toBeInstanceOf(NoteElement)
    })

    it("getNextEditPathNode", () => {
        let element = new TextElement()
        expect(() => { element.getNextEditPathNode("") }).toThrow(EndOfEditPathError)
    })

    it("stepInEachChildren", () => {
        let element = new TextElement()
        expect(() => { element.stepInEachChildren(new EditPath) }).toThrow(EndOfEditPathError)
    })
})
