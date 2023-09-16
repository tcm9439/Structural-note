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
        expect(definition.attribute_type?.type).toBe("STRING")

        definition = new AttributeDefinition("test", StringAttribute.instance, true, "description")
        expect(definition.name).toBe("test")
        expect(definition.description).toBe("description")
        expect(definition.optional).toBe(true)
        expect(definition.attribute_type).toBe(StringAttribute.instance)
    })

    it("getNextEditPathNode", () => {
        expect(definition.getNextEditPathNode("")).toBeUndefined()
    })

    it("stepInEachChildren", () => {
        expect(() => definition.stepInEachChildren(new EditPath)).toThrow(EndOfEditPathError)
    })

    it("clone", () => {
        let clone = definition.clone()
        expect(clone).not.toBe(definition)
        expect(clone.id).toEqual(definition.id)
        expect(clone.name).toEqual(definition.name)
        expect(clone.description).toEqual(definition.description)
        expect(clone.optional).toEqual(definition.optional)
        expect(clone.attribute_type).toBe(definition.attribute_type)

        clone.name = "clone"
        clone.description = "clone"
        clone.optional = !clone.optional
        expect(clone.name).not.toEqual(definition.name)
        expect(clone.description).not.toEqual(definition.description)
        expect(clone.optional).not.toEqual(definition.optional)
    })

    it("cloneDeepWithCustomizer", () => {
        let clone = definition.cloneDeepWithCustomizer()
        expect(clone).toBeUndefined()
    })

    it("cloneFrom", () => {
        // create a new definition
        let clone = new AttributeDefinition("clone", StringAttribute.instance, false, "clone")

        clone.cloneFrom(definition)
        expect(clone.id).not.toEqual(definition.id)
        expect(clone.name).toEqual(definition.name)
        expect(clone.description).toEqual(definition.description)
        expect(clone.optional).toEqual(definition.optional)
        expect(clone.attribute_type).toEqual(definition.attribute_type)

        clone.name = "clone"
        expect(clone.name).not.toEqual(definition.name)
    })
})
