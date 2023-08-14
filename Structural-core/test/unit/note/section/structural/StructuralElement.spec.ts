import { describe, it, expect, beforeEach } from "vitest"
import { StructuralElement } from '@/note/section/structural'

describe('StructuralElement', () => {
	it('constructor', () => {
        expect(new StructuralElement()).not.toBeNull()
    })

    it('getter', () => {
        const element = new StructuralElement()
        expect(element.values).not.toBeNull()
        expect(element.values).toBeInstanceOf(Map)
    })
})
