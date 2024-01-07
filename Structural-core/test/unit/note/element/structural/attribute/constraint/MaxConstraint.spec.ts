import { describe, it, expect, beforeEach } from "vitest"
import { MinConstraint } from "@/note/element/structural/attribute/constraint/MinConstraint.js"
import { MaxConstraint } from "@/note/element/structural/attribute/constraint/MaxConstraint.js"
import { ValidOperationResult } from "@/common/OperationResult.js"

describe("MaxConstraint", () => {
    let max_constraint: MaxConstraint<number>

    beforeEach(() => {
        max_constraint = new MaxConstraint<number>(100)
    })

	it("constructor", () => {
        expect(max_constraint.max).toBe(100)
        expect(max_constraint.validate_constraint_result.valid).toBe(true)
	})

	it("empty constructor", () => {
        max_constraint = new MaxConstraint<number>()
        expect(max_constraint.max).toBeNull()
        expect(max_constraint.validate_constraint_result.valid).toBe(false)
	})

    it("get set max", () => {
        max_constraint.max = 1
        expect(max_constraint.max).toBe(1)
        expect(max_constraint.validate_constraint_result.valid).toBe(true)

        max_constraint.max = null
        expect(max_constraint.max).toBeNull()
        expect(max_constraint.validate_constraint_result.valid).toBe(false)
    })

    it("get set inclusive", () => {
        expect(max_constraint.inclusive).toBe(true)
        max_constraint.inclusive = false
        expect(max_constraint.inclusive).toBe(false)
    })

    it("isConstraintValid", () => {
        expect(max_constraint.validate_constraint_result.valid).toBe(true)

        max_constraint.max = null
        expect(max_constraint.validate_constraint_result.valid).toBe(false)
    })

    it("isCompatibleTo", () => {
        // compatible to MaxConstraint?
        let new_max_constraint = new MaxConstraint<number>(1)
        expect(max_constraint.isCompatibleTo(new_max_constraint)).toBe(false)
        
        // compatible to MinConstraint?
        // - max value smaller than min value
        let min_constraint = new MinConstraint<number>(999)
        expect(max_constraint.isCompatibleTo(min_constraint)).toBe(false)

        // - max value greater than min value
        min_constraint.min = 7
        expect(max_constraint.isCompatibleTo(min_constraint)).toBe(true)
    })

    it("validate - inclusive (default)", () => {
        max_constraint.inclusive = true
        expect(max_constraint.validate(-9)).toBe(ValidOperationResult)
        expect(max_constraint.validate(100)).toBe(ValidOperationResult)
        expect(max_constraint.validate(999).valid).toBe(false)
    })

    it("validate - not inclusive", () => {
        max_constraint.inclusive = false
        expect(max_constraint.validate(-9)).toBe(ValidOperationResult)
        expect(max_constraint.validate(100).valid).toBe(false)
        expect(max_constraint.validate(999).valid).toBe(false)
    })

    it("json", () => {
        let saved_json = max_constraint.saveAsJson()
        let loaded_max_constraint = MaxConstraint.loadFromJson(saved_json)
        expect(loaded_max_constraint).toEqual(max_constraint)
    })

    it("different type", () => {
        // date
        let date_max_constraint = new MaxConstraint<Date>(new Date(2020, 1, 1))
        expect(date_max_constraint.validate(new Date(2020, 1, 1))).toBe(ValidOperationResult)
        expect(date_max_constraint.validate(new Date(2019, 12, 30))).toBe(ValidOperationResult)
        expect(date_max_constraint.validate(new Date(2020, 1, 2)).valid).toBe(false)
    })
})
