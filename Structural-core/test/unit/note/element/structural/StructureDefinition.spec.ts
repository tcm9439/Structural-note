import { describe, it, expect, beforeEach } from "vitest"
import { StructureDefinition } from '@/note/element/structural/StructureDefinition'
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute"

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
