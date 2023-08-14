import { describe, it, expect, beforeEach } from "vitest"
import { NoteSection, TextAreaSection } from "@/note/section/"

describe("TextAreaSection", () => {
    it("create & id", () => {
        let note_section: NoteSection = new TextAreaSection("Title 1")
        expect(note_section).not.toBeUndefined()
    })
})
