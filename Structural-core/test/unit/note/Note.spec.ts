import { describe, it, expect, beforeEach } from "vitest"
import { Note } from '@/note/Note'
import { NoteSection } from '@/note/section/NoteSection'

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
})
