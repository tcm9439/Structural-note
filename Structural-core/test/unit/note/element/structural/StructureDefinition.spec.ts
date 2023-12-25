import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { StructureDefinition } from '@/note/element/structural/StructureDefinition'
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute.js"
import { EditPath } from "@/note/util/EditPath.js"
import { InvalidJsonFormatException, ModuleInit } from "@/index.js"

describe('StructureDefinition', () => {
	let definition: StructureDefinition
    let str_attr: AttributeDefinition<string>
    let bool_attr: AttributeDefinition<boolean>

    beforeAll(() => {
        ModuleInit.init()
    })

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

    it("cloneFrom: attr same id", () => {
        let clone = definition.clone()
        let ori_attr = clone.attributes.get(str_attr.id)
        expect(ori_attr).not.toBeUndefined()
        if (ori_attr != undefined){
            ori_attr.name = "New name after clone"
        }
        clone.attributes.remove(bool_attr.id)

        clone.cloneFrom(definition)
        expect(clone).not.toBeNull()
        expect(clone.id).toEqual(definition.id)

        // attributes
        expect(clone.attributes.length()).toBe(2)
        expect(clone.attributes.get(str_attr.id)).toBe(ori_attr)
        expect(clone.attributes.get(str_attr.id)).toEqual(str_attr)
        expect(clone.attributes.get(bool_attr.id)).not.toBe(bool_attr)
        expect(clone.attributes.get(bool_attr.id)).toEqual(bool_attr)

        // order
        expect(clone.attributes.order.order).toEqual(definition.attributes.order.order)

        // if delete an attribute from clone, the original definition should not be affected
        clone.attributes.remove(str_attr.id)
        expect(clone.attributes.length()).toBe(1)
        expect(definition.attributes.length()).toBe(2)
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
        bool_attr.setDefaultValue(true)
        let json = definition.saveAsJson()
        expect(json).toEqual({
            id: definition.id,
            attribute_order: [str_attr.id, bool_attr.id],
            attributes: [
                {
                    id: str_attr.id,
                    name: str_attr.name,
                    description: str_attr.description,
                    attribute_type: str_attr.attribute_type?.type,
                    default_value: null,
                    constrains: [
                        {
                            id: str_attr.require_constrain.id,
                            type: "RequireConstrain",
                            required: false
                        }
                    ]
                },
                {
                    id: bool_attr.id,
                    name: bool_attr.name,
                    description: bool_attr.description,
                    attribute_type: bool_attr.attribute_type?.type,
                    default_value: true,
                    constrains: [
                        {
                            id: bool_attr.require_constrain.id,
                            type: "RequireConstrain",
                            required: false
                        }
                    ]
                }
            ]
        })
    })

    it("loadFromJson", () => {
        let json = definition.saveAsJson()
        let new_definition = StructureDefinition.loadFromJson(json)
        expect(new_definition).toEqual(definition)
    })

    it("loadFromJson: invalid json, order and attr def unmatch", () => {
        let json = {
            id: definition.id,
            attribute_order: [str_attr.id, bool_attr.id],
            attributes: [
                {
                    id: bool_attr.id,
                    name: bool_attr.name,
                    description: bool_attr.description,
                    attribute_type: bool_attr.attribute_type?.type,
                }
            ]
        }
        expect(()=>{
            StructureDefinition.loadFromJson(json)
        }).toThrowError(InvalidJsonFormatException)
    })

    it("loadFromJson: invalid json data type", () => {
        let json = {
            id: -1,
            attribute_order: [],
            attributes: []
        }
        expect(()=>{
            StructureDefinition.loadFromJson(json)
        }).toThrowError(InvalidJsonFormatException)
    })

    it("validateDefinition: valid", () => {
        expect(definition.validateDefinition().valid).toBe(true)
    })

    it("validateDefinition: no attribute", () => {
        definition.attributes.remove(str_attr.id)
        definition.attributes.remove(bool_attr.id)
        let validate_result = definition.validateDefinition()
        expect(validate_result.valid).toBe(false)
        expect(validate_result.invalid_message).toBe("There must be at least one attribute definition.")
    })

    it("validateDefinition: invalid attribute", () => {
        let invalid_attr = new AttributeDefinition("invalid", StringAttribute.instance)
        invalid_attr.name = ""
        definition.attributes.add(invalid_attr)
        let validate_result = definition.validateDefinition()
        expect(validate_result.valid).toBe(false)
        expect(validate_result.invalid_message).toBe("Attribute name cannot be empty.")
    })

    it("validateDefinition: duplicated attribute name", () => {
        let validate_result = definition.validateDefinition()
        expect(validate_result.valid).toBe(true)

        let invalid_attr = new AttributeDefinition("Str Attr", StringAttribute.instance)
        definition.attributes.add(invalid_attr)
        validate_result = definition.validateDefinition()
        expect(validate_result.valid).toBe(false)
        expect(validate_result.invalid_message).toBe(`The attribute name "Str Attr" is not unique.`)
    })
})
