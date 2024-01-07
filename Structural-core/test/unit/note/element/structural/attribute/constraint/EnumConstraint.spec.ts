import { describe, it, expect, beforeEach } from "vitest"
import { EnumConstraint, ModuleInit, ValidOperationResult } from "@/index.js"

describe("EnumConstraint", () => {
    let enum_constraint: EnumConstraint

    beforeEach(() => {
        ModuleInit.init()
        enum_constraint = new EnumConstraint(["a", "b", "c"], 5)
    })

	it("constructor", () => {
        expect(enum_constraint.available_values).toEqual(["a", "b", "c"])
        expect(enum_constraint.validate_constraint_result.valid).toBe(true)
	})

	it("empty constructor", () => {
        enum_constraint = new EnumConstraint()
        expect(enum_constraint.available_values).toEqual([])
        expect(enum_constraint.validate_constraint_result.valid).toBe(true)
	})

    it("get set available_values + isConstraintValid", () => {
        expect(enum_constraint.available_values.length).toBe(3)
        expect(enum_constraint.validate_constraint_result.valid).toBe(true)
        expect(enum_constraint["_max_index"]).toBe(5)
        
        // add new value
        enum_constraint.addAvailableValue("d")
        expect(enum_constraint.available_values.length).toBe(4)
        expect(enum_constraint.validate_constraint_result.valid).toBe(true)
        expect(enum_constraint["_max_index"]).toBe(6)
        
        // add duplicated value
        enum_constraint.addAvailableValue("a")
        expect(enum_constraint.available_values.length).toBe(4)
        expect(enum_constraint.validate_constraint_result.valid).toBe(true)
        expect(enum_constraint["_max_index"]).toBe(6)
        
        // remove value
        enum_constraint.removeAvailableValue(0) // "a"
        expect(enum_constraint.available_values.length).toBe(3)
        expect(enum_constraint.validate_constraint_result.valid).toBe(true)
        expect(enum_constraint["_max_index"]).toBe(6)
        
        // reset available_values
        enum_constraint.available_values = ["a", "b", "c", "c"]
        expect(enum_constraint.available_values.length).toBe(3)
        expect(enum_constraint["_max_index"]).toBe(9)
        expect(enum_constraint.validate_constraint_result.valid).toBe(true)
    })
    
    it("isCompatibleTo", () => {
        let new_enum_constraint = new EnumConstraint()
        expect(enum_constraint.isCompatibleTo(new_enum_constraint)).toBe(false)
    })
    
    it("validate", () => {
        expect(enum_constraint.validate(0)).toBe(ValidOperationResult) // "a"
        expect(enum_constraint.validate(1)).toBe(ValidOperationResult) // 'b
        expect(enum_constraint.validate(1024).valid).toBe(false)
    })
    
    it("json", () => {
        enum_constraint.removeAvailableValue(0) // "a"
        let saved_json = enum_constraint.saveAsJson()
        let loaded_enum_constraint = EnumConstraint.loadFromJson(saved_json)
        expect(loaded_enum_constraint).toEqual(enum_constraint)
    })

    it("json with no enum value", () => {
        let enum_constraint2 = new EnumConstraint()
        let saved_json = enum_constraint2.saveAsJson()
        console.log(saved_json)
        let loaded_enum_constraint = EnumConstraint.loadFromJson(saved_json)
        expect(loaded_enum_constraint).toEqual(enum_constraint2)

        let enum_constraint3_json = {
            "id": "20992a6a-f90c-45f5-bd76-3472e7171c0c",
            "type": "EnumConstraint",
            "values": {
                2: "a",
            },
            "max_index": 3
        }
        let expected_enum_constraint3 = new EnumConstraint([], 2)
        expected_enum_constraint3.addAvailableValue("a")
        expected_enum_constraint3["id"] = "20992a6a-f90c-45f5-bd76-3472e7171c0c"
        expect(EnumConstraint.loadFromJson(enum_constraint3_json)).toEqual(expected_enum_constraint3)
    })
})

