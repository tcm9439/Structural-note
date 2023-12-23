import { describe, it, expect, beforeEach } from "vitest"
import { NoteElement } from "@/note/element/NoteElement.js"
import { TextElement } from "@/note/element/TextElement.js"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath.js"

describe("NoteElement", () => {
    it("constructor", () => {
        let element = new TextElement()
        expect(element).toBeInstanceOf(NoteElement)
    })

    it("getNextEditPathNode", () => {
        let element = new TextElement()
        expect(element.getNextEditPathNode("")).toBeUndefined()
    })

    it("stepInEachChildren", () => {
        let element = new TextElement()
        expect(() => { element.stepInEachChildren(new EditPath) }).toThrow(EndOfEditPathError)
    })
})
