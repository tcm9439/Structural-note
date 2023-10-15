import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { MaxConstrain } from "@/note/element/structural/attribute/constrain/MaxConstrain"
import { ForbiddenConstrain, IncompatibleConstrain } from "@/note/element/structural/attribute/exception/AttributeException"
import { ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"
import _ from "lodash"

describe('AttributeDefinition', () => {
	let definition: AttributeDefinition<string>

    beforeEach(() => {
        definition = new AttributeDefinition("test", StringAttribute.instance, "description ABC!")  
    })

    it('constructor & getter', () => {
        expect(definition.name).toBe("test")
        expect(definition.description).toBe("description ABC!")
        expect(definition.attribute_type).toBe(StringAttribute.instance)
    })

    it("getNextEditPathNode", () => {
        const constrain = new RequireConstrain(true)
        definition.addConstrain(constrain)
        expect(definition.getNextEditPathNode("")).toBeUndefined()
        expect(definition.getNextEditPathNode(constrain.id)).toBe(constrain)
    })

    it("stepInEachChildren", () => {
        let edit_path = (new EditPath()).append(definition.id)
        expect(definition.stepInEachChildren(edit_path)).toEqual([])

        const constrain = new RequireConstrain(true)
        definition.addConstrain(constrain)
        let edit_paths = definition.stepInEachChildren(edit_path)
        expect(edit_paths.length).toBe(1)
        expect(edit_paths[0].getLastStep()).toBe(constrain.id)
    })

    it("clone", () => {
        let clone = definition.clone()
        expect(clone).not.toBe(definition)
        expect(clone.id).toEqual(definition.id)
        expect(clone.name).toEqual(definition.name)
        expect(clone.description).toEqual(definition.description)
        expect(clone.attribute_type).toBe(definition.attribute_type)

        clone.name = "clone"
        clone.description = "clone"
        expect(clone.name).not.toEqual(definition.name)
        expect(clone.description).not.toEqual(definition.description)
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
        expect(clone.attribute_type).toEqual(definition.attribute_type)

        clone.name = "clone"
        expect(clone.name).not.toEqual(definition.name)
    })

    it("saveAsJson", () => {
        let json = definition.saveAsJson()
        expect(json).toEqual({
            id: definition.id,
            name: "test",
            description: "description ABC!",
            attribute_type: "STRING"
        })
    })

    it("loadFromJson", () => {
        let json = definition.saveAsJson()
        let new_definition = AttributeDefinition.loadFromJson(json)
        expect(new_definition).toEqual(definition)
    })

    it("loadFromJson with null attribute type", () => {
        let json = definition.saveAsJson()
        _.set(json, "attribute_type", null)
        expect(AttributeDefinition.loadFromJson(json)).toBeNull()
    })

    it("addConstrain", () => {
        // valid constrain
        definition.addConstrain(new RequireConstrain())
        expect(definition.constrains.size).toBe(1)

        // incompatible constrain
        expect(() => definition.addConstrain(new RequireConstrain())).toThrowError(IncompatibleConstrain)

        // forbidden constrain
        expect(() => definition.addConstrain(new MinConstrain(10))).toThrowError(ForbiddenConstrain)
    })

    it("getAvailableConstrains", () => {
        // has attribute type, no existing constrain to be incompatible with others
        expect(definition.getAvailableConstrains()).toEqual(StringAttribute.instance.available_constraints)

        // has attribute type, existing constrain to be incompatible with others
        definition.addConstrain(new RequireConstrain())
        expect(definition.getAvailableConstrains()).toEqual([])

        // has no attribute type
        let new_attr_def = new AttributeDefinition("test")
        expect(new_attr_def.getAvailableConstrains()).toEqual([])
    })

    it("validate: one constrain", () => {
        expect(definition.validate("Hello World").valid).toBeTruthy()
        definition.addConstrain(new RequireConstrain())
        expect(definition.constrains.size).toBe(1)
        expect(definition.validate("Hello World").valid).toBeTruthy()
        expect(definition.validate(null).valid).toBeFalsy()
    })

    it("validate: multiple constrains", () => {
        let num_attr_def = new AttributeDefinition("test", IntegerAttribute.instance, "description ABC!")
        num_attr_def.addConstrain(new RequireConstrain())
        num_attr_def.addConstrain(new MinConstrain(10))
        num_attr_def.addConstrain(new MaxConstrain(1000))
        expect(num_attr_def.validate(100).valid).toBeTruthy()
        expect(num_attr_def.validate(1).valid).toBeFalsy()
        expect(num_attr_def.validate(null).valid).toBeFalsy()
    })

    it("convertToType: no type", () => {
        let no_type_attr_def = new AttributeDefinition("no type")
        let new_attr_def = AttributeDefinition.convertToType(no_type_attr_def, StringAttribute.instance)
        expect(new_attr_def).not.toBeNull()
        expect(new_attr_def?.attribute_type).toBe(StringAttribute.instance)
        expect(new_attr_def?.constrains.size).toBe(0)
        expect(new_attr_def?.id).toBe(no_type_attr_def.id)
        expect(new_attr_def?.name).toBe(no_type_attr_def.name)
        expect(new_attr_def?.description).toBe(no_type_attr_def.description)
    })

    it("convertToType: incompatible constrain", () => {
        // convert from int to string
        // min and max constrain are incompatible with string attribute
        let num_attr_def = new AttributeDefinition("test", IntegerAttribute.instance, "description ABC!")
        let require_constrain = new RequireConstrain()
        num_attr_def.addConstrain(require_constrain)
        num_attr_def.addConstrain(new MinConstrain(10))
        num_attr_def.addConstrain(new MaxConstrain(1000))

        let new_attr_def = AttributeDefinition.convertToType(num_attr_def, StringAttribute.instance)
        expect(new_attr_def).not.toBeNull()
        expect(new_attr_def?.attribute_type).toBe(StringAttribute.instance)
        expect(new_attr_def?.constrains.size).toBe(1)
        expect(new_attr_def?.constrains.get(require_constrain.id)).toBeInstanceOf(RequireConstrain)
        expect(new_attr_def?.id).toBe(num_attr_def.id)
        expect(new_attr_def?.name).toBe(num_attr_def.name)
        expect(new_attr_def?.description).toBe(num_attr_def.description)
    })

    it("validateDefinition: valid", () => {
        expect(definition.validateDefinition()).toBe(ValidValidateResult)
    })

    it("validateDefinition: empty name", () => {
        definition.name = ""
        let validate_result = definition.validateDefinition()
        expect(validate_result.valid).toBe(false)
        expect(validate_result.invalid_message).toBe("Attribute name cannot be empty.")
    })

    it("validateDefinition: empty attribute type", () => {
        let no_type_attr_def = new AttributeDefinition("no type")
        let validate_result = no_type_attr_def.validateDefinition()
        expect(validate_result.valid).toBe(false)
        expect(validate_result.invalid_message).toBe(`Attribute type cannot be empty for attribute "no type"`)
    })

    it("validateDefinition: invalid constrain", () => {
        let num_attr_def = new AttributeDefinition("test", IntegerAttribute.instance, "description ABC!")
        let min_constrain = new MinConstrain()
        num_attr_def.addConstrain(min_constrain)
        min_constrain.min = null
        let validate_result = num_attr_def.validateDefinition()
        expect(validate_result.valid).toBe(false)
        expect(validate_result.invalid_message).toBe(`Constrain MIN for attribute "test" is invalid: The minimum value is not set`)
    })

    it("validateDefinition: invalid default value", () => {
        // TODO default value
    })
})
