import { describe, it, expect, beforeEach } from "vitest"
import { StructureDefinition } from '@/note/element/structural/StructureDefinition'
import { AttributeDefinition, BooleanAttribute, StringAttribute } from "@/note/element/structural"

describe('StructureDefinition', () => {
	let definition: StructureDefinition

    beforeEach(() => {
        definition = new StructureDefinition()
        definition.attributes.add(new AttributeDefinition("Str Attr", StringAttribute.instance))
        definition.attributes.add(new AttributeDefinition("Bool Attr2", BooleanAttribute.instance))
    })

    it('constructor', () => {
        expect(definition).not.toBeNull()
    })

    it('getter', () => {
        expect(definition.attributes).not.toBeNull()
        expect(definition.attributes.length()).toBe(2)
    })
})
