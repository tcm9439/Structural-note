import { describe, it, expect, beforeEach } from "vitest"
import { ComponentBase } from '@/note/common/ComponentBase'
import { Note } from "@/note"

describe('ComponentBase', () => {
    it('constructor & get id', () => {
        let component = new Note("ABC")
        expect(component).not.toBeUndefined()
        expect(component.id).not.toBeUndefined()
    })

	it('generateNewId', () => {
        let id = ComponentBase.generateNewId()
        expect(id).not.toBeUndefined()
        let id2 = ComponentBase.generateNewId()
        expect(id2).not.toBeUndefined()
        expect(id).not.toBe(id2)
	})
})
