import { describe, it, expect, beforeEach } from "vitest"
import { StructuralSection } from '@/note/section/StructuralSection'

describe('StructuralSection', () => {
    let section : StructuralSection

    beforeEach(() => {
        section = new StructuralSection('title')
    })

	it('constructor', () => {
        expect(section).toBeDefined()
	})

    it('get definition', () => {
        expect(section.definition).toBeDefined()
    })
})
