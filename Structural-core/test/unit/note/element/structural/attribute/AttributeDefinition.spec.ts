import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"

describe('AttributeDefinition', () => {
	let definition: AttributeDefinition<string>

    it('constructor & getter', () => {
        definition = new AttributeDefinition("test", StringAttribute.instance)
        expect(definition.name).toBe("test")
        expect(definition.description).toBe("")
        expect(definition.optional).toBe(false)
        expect(definition.attributeType).toBe(StringAttribute.instance)

        definition = new AttributeDefinition("test", StringAttribute.instance, true, "description")
        expect(definition.name).toBe("test")
        expect(definition.description).toBe("description")
        expect(definition.optional).toBe(true)
        expect(definition.attributeType).toBe(StringAttribute.instance)
    })

    it('create', () => {
        definition = new AttributeDefinition("test", StringAttribute.instance)
        expect(definition.create("test").value).toBe("test")
    })
})
