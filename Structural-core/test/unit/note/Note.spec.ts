import { describe, it, expect, beforeEach } from "vitest"
import { Note } from '@/note/Note'
import { NoteSection } from '@/note/section/NoteSection'
import { EditPath } from "@/note/util/EditPath"

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
})
