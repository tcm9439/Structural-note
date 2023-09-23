import { describe, it, expect, beforeEach } from "vitest"
import { StructureDefinition } from '@/note/element/structural/StructureDefinition'
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute"
import { EditPath } from "@/note/util/EditPath"

describe('StructureDefinition', () => {
	let definition: StructureDefinition
    let str_attr: AttributeDefinition<string>
    let bool_attr: AttributeDefinition<boolean>

    beforeEach(() => {
        definition = new StructureDefinition()
        str_attr = new AttributeDefinition("Str Attr", StringAttribute.instance)
        definition.attributes.add(str_attr)
        bool_attr = new AttributeDefinition("Bool Attr", BooleanAttribute.instance)
        definition.attributes.add(bool_attr)
    })

    it('constructor', () => {
        expect(definition).not.toBeNull()
    })

    it("get attributes", () => {
        expect(definition.attributes).not.toBeNull()
        expect(definition.attributes.length()).toBe(2)
    })

    it("getNextEditPathNode", () => {
        let new_attr_def = new AttributeDefinition("attr-definition", StringAttribute.instance)
        expect(definition.getNextEditPathNode(new_attr_def.id)).toBeUndefined()
        
        definition.attributes.add(new_attr_def)
        expect(definition.attributes.length()).toBe(3)
        expect(definition.getNextEditPathNode(new_attr_def.id)).toBe(new_attr_def)
    })

    it("stepInEachChildren", () => {
        let edit_path = new EditPath()
        let edit_paths = definition.stepInEachChildren(edit_path)
        expect(edit_paths.length).toBe(2)
        expect(edit_paths[0].getLastStep()).toBe(str_attr.id)
        expect(edit_paths[1].getLastStep()).toBe(bool_attr.id)
    })

    it("clone", () => {
        let clone = definition.clone()
        expect(clone).not.toBeNull()
        // same id
        expect(clone.id).toEqual(definition.id)

        // attributes are deep copied
        expect(clone.attributes.length()).toBe(definition.attributes.length())
        expect(clone.attributes.get(str_attr.id)).not.toBe(str_attr)
        expect(clone.attributes.get(bool_attr.id)).not.toBe(bool_attr)

        // if delete an attribute from clone, the original definition should not be affected
        clone.attributes.remove(str_attr.id)
        expect(clone.attributes.length()).toBe(1)
        expect(definition.attributes.length()).toBe(2)

        // if alter the attribute in clone, the original definition should not be affected
        let cloned_bool_atr = clone.attributes.get(bool_attr.id) as AttributeDefinition<boolean>
        cloned_bool_atr.name = "new name"
        expect(cloned_bool_atr.name).toBe("new name")
        expect(bool_attr.name).toBe("Bool Attr")
        expect(definition.attributes.get(bool_attr.id)?.name).toBe("Bool Attr")
    })

    it("cloneDeepWithCustomizer", () => {
        let clone = definition.cloneDeepWithCustomizer()
        expect(clone).toBeUndefined()
    })

    it("cloneFrom", () => {
        let clone = new StructureDefinition()
        clone.cloneFrom(definition)
        expect(clone).not.toBeNull()
        // diff id
        expect(clone.id).not.toEqual(definition.id)

        // attributes are deep copied
        expect(clone.attributes.length()).toBe(definition.attributes.length())
        expect(clone.attributes.get(str_attr.id)).not.toBe(str_attr)
        expect(clone.attributes.get(bool_attr.id)).not.toBe(bool_attr)

        // if delete an attribute from clone, the original definition should not be affected
        clone.attributes.remove(str_attr.id)
        expect(clone.attributes.length()).toBe(1)
        expect(definition.attributes.length()).toBe(2)
    })

    it("saveAsJson", () => {
        let json = definition.saveAsJson()
        expect(json).toEqual({
            id: definition.id,
            attribute_order: [str_attr.id, bool_attr.id],
            attributes: [
                {
                    id: str_attr.id,
                    name: str_attr.name,
                    description: str_attr.description,
                    optional: str_attr.optional,
                    attribute_type: str_attr.attribute_type?.type
                },
                {
                    id: bool_attr.id,
                    name: bool_attr.name,
                    description: bool_attr.description,
                    optional: bool_attr.optional,
                    attribute_type: bool_attr.attribute_type?.type
                }
            ]
        })
    })

    it("loadFromJson", () => {
        let json = definition.saveAsJson()
        let new_definition = StructureDefinition.loadFromJson(json)
        expect(new_definition).toEqual(definition)
    })
})
