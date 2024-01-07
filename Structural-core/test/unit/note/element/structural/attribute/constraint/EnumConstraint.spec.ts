import { describe, it, expect, beforeEach } from "vitest"
import { EnumConstraint, ValidOperationResult } from "@/index.js"

describe("EnumConstraint", () => {
    let enum_constraint: EnumConstraint

    beforeEach(() => {
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
})

