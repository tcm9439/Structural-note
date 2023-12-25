import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute.js"
import { EditPath } from "@/note/util/EditPath.js"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain.js"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain.js"
import { MaxConstrain } from "@/note/element/structural/attribute/constrain/MaxConstrain.js"
import { ForbiddenConstrain, IncompatibleConstrain } from "@/exception/AttributeException.js"
import { ValidOperationResult } from "@/common/OperationResult.js"
import { ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"
import { AppState, ModuleInit } from "@/index.js"

import _ from "lodash"

describe('AttributeDefinition', () => {
	let definition: AttributeDefinition<number>

    beforeAll(async () => {
        await ModuleInit.init()
    })

    beforeEach(() => {
        definition = new AttributeDefinition("test", IntegerAttribute.instance, "description ABC!")  
    })

    it('constructor & getter', () => {
        expect(definition.name).toBe("test")
        expect(definition.description).toBe("description ABC!")
        expect(definition.attribute_type).toBe(IntegerAttribute.instance)
    })

    it("getNextEditPathNode", () => {
        const constrain = definition.require_constrain
        expect(definition.getNextEditPathNode("")).toBeUndefined()
        expect(definition.getNextEditPathNode(constrain.id)).toBe(constrain)
    })

    it("stepInEachChildren", () => {
        const constrain = definition.require_constrain
        let edit_path = (new EditPath()).append(definition.id)
        let children = definition.stepInEachChildren(edit_path)
        expect(children.length).toEqual(1)
        expect(children[0].getLastStep()).toEqual(constrain.id)
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
        let clone = new AttributeDefinition("clone", IntegerAttribute.instance, "clone")

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
            attribute_type: "INT",
            default_value: null,
            constrains: [
                {
                    id: definition.require_constrain.id,
                    type: "RequireConstrain",
                    required: false
                }
            ]
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
        expect(() => AttributeDefinition.loadFromJson(json)).toThrow(InvalidJsonFormatException)
    })

    it("addConstrain", () => {
        // valid constrain
        definition.addConstrain(new MinConstrain(10))
        expect(definition.constrains.size).toBe(2) // require constrain is added by default

        // incompatible constrain
        expect(definition.addConstrain(new RequireConstrain())).toBeInstanceOf(IncompatibleConstrain)

        // forbidden constrain
        let str_def = new AttributeDefinition("test", StringAttribute.instance)
        expect(str_def.addConstrain(new MinConstrain(10))).toBeInstanceOf(ForbiddenConstrain)
    })

    it("getAvailableConstrains", () => {
        // def has attribute type, no existing constrain to be incompatible with others
        expect(definition.getAvailableConstrains()).toEqual([
            ConstrainType.MIN,
            ConstrainType.MAX,
            ConstrainType.UNIQUE,
        ])

        definition.addConstrain(new MinConstrain(34))
        expect(definition.getAvailableConstrains()).toEqual([
            ConstrainType.MAX,
            ConstrainType.UNIQUE,
            // no MIN because it is already added
        ])

        // def has no attribute type => no available constrain
        let new_attr_def = new AttributeDefinition("test")
        expect(new_attr_def.getAvailableConstrains()).toEqual([])
    })

    it("isOptionalAttr", () => {
        // default optional
        expect(definition.require_constrain).not.toBeNull()
        expect(definition.isOptionalAttr()).toBeTruthy()
        // change to required
        definition.require_constrain.required = true
        expect(definition.isOptionalAttr()).toBeFalsy()
    })

    it("validate: one constrain", () => {
        expect(definition.constrains.size).toBe(1) // require constrain is added by default
        expect(definition.validate(22).valid).toBeTruthy()
        definition.require_constrain.required = true
        expect(definition.validate(null).valid).toBeFalsy()
    })

    it("validate: multiple constrains", () => {
        definition.require_constrain.required = true
        definition.addConstrain(new MinConstrain(10))
        definition.addConstrain(new MaxConstrain(1000))
        expect(definition.validate(100).valid).toBeTruthy()
        expect(definition.validate(1).valid).toBeFalsy()
        expect(definition.validate(null).valid).toBeFalsy()
    })

    it("convertToType: no type", () => {
        let no_type_attr_def = new AttributeDefinition("no type")
        let new_attr_def = AttributeDefinition.convertToType(no_type_attr_def, StringAttribute.instance)
        expect(new_attr_def).not.toBeNull()
        expect(new_attr_def?.attribute_type).toBe(StringAttribute.instance)
        expect(new_attr_def?.constrains.size).toBe(1)
        expect(new_attr_def?.id).toBe(no_type_attr_def.id)
        expect(new_attr_def?.name).toBe(no_type_attr_def.name)
        expect(new_attr_def?.description).toBe(no_type_attr_def.description)
    })

    it("convertToType: incompatible constrain", () => {
        // convert from int to string
        // min and max constrain are incompatible with string attribute
        let num_attr_def = new AttributeDefinition("test", IntegerAttribute.instance, "description ABC!")
        num_attr_def.addConstrain(new MinConstrain(10))
        num_attr_def.addConstrain(new MaxConstrain(1000))

        let new_attr_def = AttributeDefinition.convertToType(num_attr_def, StringAttribute.instance)
        expect(new_attr_def).not.toBeNull()
        expect(new_attr_def?.attribute_type).toBe(StringAttribute.instance)
        expect(new_attr_def?.constrains.size).toBe(1)
        expect(new_attr_def?.require_constrain).toBeInstanceOf(RequireConstrain)
        expect(new_attr_def?.id).toBe(num_attr_def.id)
        expect(new_attr_def?.name).toBe(num_attr_def.name)
        expect(new_attr_def?.description).toBe(num_attr_def.description)
    })

    it("validateDefinition: valid", () => {
        expect(definition.validateDefinition()).toBe(ValidOperationResult)
    })

    it("validateDefinition: empty name", () => {
        definition.name = ""
        let validate_result = definition.validateDefinition()
        expect(validate_result.valid).toBe(false)
        AppState.translationManager.default_language_code = "en"
        expect(validate_result.invalid_message).toBe("Attribute name cannot be empty.")
    })

    it("validateDefinition: empty attribute type", () => {
        let no_type_attr_def = new AttributeDefinition("no type")
        let validate_result = no_type_attr_def.validateDefinition()
        expect(validate_result.valid).toBe(false)
        AppState.translationManager.default_language_code = "zh-HK"
        expect(validate_result.invalid_message).toBe("欄目「no type」缺少類型。")
        AppState.translationManager.default_language_code = "en"
        expect(validate_result.invalid_message).toBe("Attribute type cannot be empty for attribute 'no type'.")
    })

    it("validateDefinition: invalid constrain", () => {
        let num_attr_def = new AttributeDefinition("test", IntegerAttribute.instance, "description ABC!")
        let min_constrain = new MinConstrain()
        num_attr_def.addConstrain(min_constrain)
        min_constrain.min = null
        let validate_result = num_attr_def.validateDefinition()
        expect(validate_result.valid).toBe(false)
        expect(validate_result.invalid_message).toBe(`Constraint 'Minimum' for attribute 'test' is invalid: The minimum value is not set.`)
    })

    it("validateDefinition: invalid default value", () => {
        definition.addConstrain(new MinConstrain(8))
        definition.setDefaultValue(1)
        let validate_result = definition.validateDefinition()
        expect(validate_result.valid).toBeFalsy()
    })
})
