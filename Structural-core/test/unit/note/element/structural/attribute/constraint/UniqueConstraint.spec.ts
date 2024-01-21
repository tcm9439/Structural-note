import { describe, it, expect, beforeEach } from "vitest"
import { ValidOperationResult, StructuralSection, AttributeDefinition, StringAttribute, UniqueConstraint, StructuralElement, AttributeValue, ShortStringAttribute } from "@/index.js"


class TempClass {
    value: string
    constructor(value: string){
        this.value = value
    }
    equals(other: TempClass){
        return this.value == other.value
    }
}

describe("UniqueConstraint", () => {
    it("isEquals", () => {
        expect(UniqueConstraint.isEquals(1, 1)).toBeTruthy()
        expect(UniqueConstraint.isEquals(1, 3)).toBeFalsy()
        expect(UniqueConstraint.isEquals(new TempClass("1"), new TempClass("1"))).toBeTruthy()
        expect(UniqueConstraint.isEquals(new TempClass("1"), new TempClass("3"))).toBeFalsy()
    })

    it("isRelatedToOtherValues", () => {
        let unique = new UniqueConstraint()
        expect(unique.isRelatedToOtherValues()).toBeTruthy()
    })

	it("validate", () => {
        // any value is valid w.r.t. to self
        let unique = new UniqueConstraint()
        expect(unique.validate(null)).toEqual(ValidOperationResult)
        expect(unique.validate("")).toEqual(ValidOperationResult)
        expect(unique.validate("Test")).toEqual(ValidOperationResult)
	})

    it("validateValueGroup", () => {
        let unique = new UniqueConstraint()
        let values = [1, 2, 3]
        expect(unique.validateValueGroup(values)).toEqual(ValidOperationResult)
        values = [2, 2, 3]
        expect(unique.validateValueGroup(values).valid).toEqual(false)

        let temp_values = [new TempClass("1"), new TempClass("2"), new TempClass("3")]
        expect(unique.validateValueGroup(temp_values)).toEqual(ValidOperationResult)
        temp_values = [new TempClass("1"), new TempClass("2"), new TempClass("2")]
        expect(unique.validateValueGroup(temp_values).valid).toEqual(false)
	})


    it("saveAsJson", () => {
        let unique = new UniqueConstraint()
        expect(unique.saveAsJson()).toEqual({
            id: unique.id,
            type: "UniqueConstraint",
        })
    })

    it("loadFromJson", () => {
        let unique = new UniqueConstraint()
        let json = unique.saveAsJson()
        expect(UniqueConstraint.loadFromJson(json)).toEqual(unique)
    })

    it("integration test", () => {
        // create a structure section
        let section = new StructuralSection("test section")
        let attr_definition = new AttributeDefinition("attr1", ShortStringAttribute.instance, "attr1 desc", section.getValuesOfAttr.bind(section))
        section.definition.attributes.add(attr_definition)
        attr_definition.addConstraint(new UniqueConstraint())
        let element_1 = new StructuralElement(section.definition)
        let element_2 = new StructuralElement(section.definition)
        let element_3 = new StructuralElement(section.definition)
        // add the elements to section
        section.elements.add(element_1)
        section.elements.add(element_2)
        section.elements.add(element_3)

        // set values
        console.log('setting values 1')
        element_1.values.set(attr_definition.id, new AttributeValue(attr_definition, "abc"))
        console.log('setting values 2')
        element_2.values.set(attr_definition.id, new AttributeValue(attr_definition, "def"))
        console.log('setting values 3')
        element_3.values.set(attr_definition.id, new AttributeValue(attr_definition, "ghi"))
        
        // expect(section.getValuesOfAttr(attr_definition.id)).toEqual(["abc", "def", "ghi"])
        // expect(attr_definition.getGetAllRelatedValuesFunc()(attr_definition.id)).toEqual(["abc", "def", "ghi"])
        
        // assert all value are valid
        expect(element_1.values.get(attr_definition.id)?.validate_result.valid).toBe(true)
        expect(element_2.values.get(attr_definition.id)?.validate_result.valid).toBe(true)
        expect(element_3.values.get(attr_definition.id)?.validate_result.valid).toBe(true)
        
        console.log('setting values 4')
        let value = element_2.values.get(attr_definition.id) as AttributeValue<string>
        value.value = "abc"
        // expect(section.getValuesOfAttr(attr_definition.id)).toEqual(["abc", "abc", "ghi"])
        // expect(attr_definition.getGetAllRelatedValuesFunc()(attr_definition.id)).toEqual(["abc", "abc", "ghi"])
        expect(element_2.values.get(attr_definition.id)?.validate_result.valid).toBe(false)
    })
})

