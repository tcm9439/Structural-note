import { describe, it, expect, beforeAll } from "vitest"
import { EnumAttribute, AttributeDefinition, InvalidTypeConversionException, AttributeValue, ConstraintType, EnumConstraint, ModuleInit } from "@/index.js"

describe("EnumAttribute", () => {
    beforeAll(async () => {
        await ModuleInit.init()
    })

	it("instance", () => {
        expect(EnumAttribute.instance).not.toBeNull()
    })

    it("convertToString", () => {
        let param = {
            enum: new Map([
                [0, "aa"],
                [2, "bb"],
                [9, "xx"],
            ])
        }
        expect(EnumAttribute.convertToString(0, param)).toBe("aa")
        expect(EnumAttribute.convertToString(2, param)).toBe("bb")
        expect(() => EnumAttribute.convertToString(99, param)).toThrow(InvalidTypeConversionException)
        expect(() => EnumAttribute.convertToString(2)).toThrow(InvalidTypeConversionException)
    })

    it("findMissingConstraint", () => {
        let missing_constraints = EnumAttribute.instance.findMissingConstraint([])
        expect(missing_constraints.length).toBe(1)
        expect(missing_constraints[0].getType()).toBe(ConstraintType.ENUM)

        missing_constraints = EnumAttribute.instance.findMissingConstraint([
            new EnumConstraint(["a", "b", "c"])
        ])
        expect(missing_constraints.length).toBe(0)
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", EnumAttribute.instance)

        // missing enum constraint
        definition.removeConstraint(definition.getConstraint(ConstraintType.ENUM)!.id)
        let result = definition.validateDefinition()
        expect(result.valid).toBeFalsy()
        
        // add enum constraint
        definition.addConstraint(new EnumConstraint(["a", "b", "c"]))
        result = definition.validateDefinition()
        expect(result.valid).toBeTruthy()

        let value = new AttributeValue(definition)
        expect(value.value).toBe(0)
    })
})