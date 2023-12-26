import { describe, it, expect, beforeEach } from "vitest"
import { MinConstraint } from "@/note/element/structural/attribute/constraint/MinConstraint.js"
import { MaxConstraint } from "@/note/element/structural/attribute/constraint/MaxConstraint.js"
import { ValidOperationResult } from "@/common/OperationResult.js"

describe("MinConstraint", () => {
    let min_constraint: MinConstraint<number>

    beforeEach(() => {
        min_constraint = new MinConstraint<number>(0)
    })

	it("constructor", () => {
        expect(min_constraint.min).toBe(0)
        expect(min_constraint.validate_constraint_result.valid).toBe(true)
	})

	it("empty constructor", () => {
        min_constraint = new MinConstraint<number>()
        expect(min_constraint.min).toBeNull()
        expect(min_constraint.validate_constraint_result.valid).toBe(false)
	})

    it("get set min", () => {
        min_constraint.min = 1
        expect(min_constraint.min).toBe(1)
        expect(min_constraint.validate_constraint_result.valid).toBe(true)

        min_constraint.min = null
        expect(min_constraint.min).toBeNull()
        expect(min_constraint.validate_constraint_result.valid).toBe(false)
    })

    it("constraintIsValid", () => {
        expect(min_constraint.validate_constraint_result.valid).toBe(true)

        min_constraint.min = null
        expect(min_constraint.validate_constraint_result.valid).toBe(false)
    })

    it("isCompatibleTo", () => {
        // compatible to MinConstraint?
        let new_min_constraint = new MinConstraint<number>(1)
        expect(min_constraint.isCompatibleTo(new_min_constraint)).toBe(false)
        
        // compatible to MaxConstraint?
        // - max value smaller than min value
        let max_constraint = new MaxConstraint<number>(-1)
        expect(min_constraint.isCompatibleTo(max_constraint)).toBe(false)

        // - max value greater than min value
        max_constraint.max = 1
        expect(min_constraint.isCompatibleTo(max_constraint)).toBe(true)
    })

    it("validate", () => {
        expect(min_constraint.validate(0)).toBe(ValidOperationResult)
        expect(min_constraint.validate(199)).toBe(ValidOperationResult)
        expect(min_constraint.validate(-9).valid).toBe(false)
    })

    it("json", () => {
        let saved_json = min_constraint.saveAsJson()
        let loaded_min_constraint = MinConstraint.loadFromJson(saved_json)
        expect(loaded_min_constraint).toEqual(min_constraint)
    })

    it("different type", () => {
        // date
        let date_min_constraint = new MinConstraint<Date>(new Date(2020, 1, 1))
        expect(date_min_constraint.validate(new Date(2020, 1, 1))).toBe(ValidOperationResult)
        expect(date_min_constraint.validate(new Date(2020, 1, 2))).toBe(ValidOperationResult)
        expect(date_min_constraint.validate(new Date(2019, 12, 31)).valid).toBe(false)
    })
})
