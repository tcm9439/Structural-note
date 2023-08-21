import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath"

describe('AttributeDefinition', () => {
	let definition: AttributeDefinition<string>

    it('constructor & getter', () => {
        definition = new AttributeDefinition("test", StringAttribute.instance)
        expect(definition.name).toBe("test")
        expect(definition.description).toBe("")
        expect(definition.optional).toBe(false)
        expect(definition.attribute_type).toBe(StringAttribute.instance)
        expect(definition.attribute_type.type).toBe("STRING")

        definition = new AttributeDefinition("test", StringAttribute.instance, true, "description")
        expect(definition.name).toBe("test")
        expect(definition.description).toBe("description")
        expect(definition.optional).toBe(true)
        expect(definition.attribute_type).toBe(StringAttribute.instance)
    })

    it("getNextEditPathNode", () => {
        expect(() => definition.getNextEditPathNode("")).toThrow(EndOfEditPathError)
    })

    it("stepInEachChildren", () => {
        expect(() => definition.stepInEachChildren(new EditPath)).toThrow(EndOfEditPathError)
    })
})
