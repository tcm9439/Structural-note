import { describe, it, expect, beforeEach } from "vitest"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { MaxConstrain } from "@/note/element/structural/attribute/constrain/MaxConstrain"
import { ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"

describe("MinConstrain", () => {
    let min_constrain: MinConstrain<number>

    beforeEach(() => {
        min_constrain = new MinConstrain<number>(0)
    })

	it("constructor", () => {
        expect(min_constrain.min).toBe(0)
        expect(min_constrain.validate_constrain_result.valid).toBe(true)
	})

	it("empty constructor", () => {
        min_constrain = new MinConstrain<number>()
        expect(min_constrain.min).toBeNull()
        expect(min_constrain.validate_constrain_result.valid).toBe(false)
	})

    it("get set min", () => {
        min_constrain.min = 1
        expect(min_constrain.min).toBe(1)
        expect(min_constrain.validate_constrain_result.valid).toBe(true)

        min_constrain.min = null
        expect(min_constrain.min).toBeNull()
        expect(min_constrain.validate_constrain_result.valid).toBe(false)
    })

    it("constrainIsValid", () => {
        expect(min_constrain.validate_constrain_result.valid).toBe(true)

        min_constrain.min = null
        expect(min_constrain.validate_constrain_result.valid).toBe(false)
    })

    it("isCompatibleTo", () => {
        // compatible to MinConstrain?
        let new_min_constrain = new MinConstrain<number>(1)
        expect(min_constrain.isCompatibleTo(new_min_constrain)).toBe(false)
        
        // compatible to MaxConstrain?
        // - max value smaller than min value
        let max_constrain = new MaxConstrain<number>(-1)
        expect(min_constrain.isCompatibleTo(max_constrain)).toBe(false)

        // - max value greater than min value
        max_constrain.max = 1
        expect(min_constrain.isCompatibleTo(max_constrain)).toBe(true)
    })

    it("validate", () => {
        expect(min_constrain.validate(0)).toBe(ValidValidateResult)
        expect(min_constrain.validate(199)).toBe(ValidValidateResult)
        expect(min_constrain.validate(-9).valid).toBe(false)
    })

    it("json", () => {
        let saved_json = min_constrain.saveAsJson()
        let loaded_min_constrain = MinConstrain.loadFromJson(saved_json)
        expect(loaded_min_constrain).toEqual(min_constrain)
    })

    it("different type", () => {
        // date
        let date_min_constrain = new MinConstrain<Date>(new Date(2020, 1, 1))
        expect(date_min_constrain.validate(new Date(2020, 1, 1))).toBe(ValidValidateResult)
        expect(date_min_constrain.validate(new Date(2020, 1, 2))).toBe(ValidValidateResult)
        expect(date_min_constrain.validate(new Date(2019, 12, 31)).valid).toBe(false)
    })
})
