import { describe, it, expect, beforeEach } from "vitest"
import { ComponentBase } from '@/note/util/ComponentBase'
import { Note } from "@/note/Note"

describe('ComponentBase', () => {
    it('get set id', () => {
        let component = new Note("ABC")
        expect(component).not.toBeUndefined()
        expect(component.id).not.toBeUndefined()

        component["id"] = "ABC2"
        expect(component.id).toBe("ABC2")
    })

	it('generateNewId', () => {
        let id = ComponentBase.generateNewId()
        expect(id).not.toBeUndefined()
        let id2 = ComponentBase.generateNewId()
        expect(id2).not.toBeUndefined()
        expect(id).not.toBe(id2)
	})
})
