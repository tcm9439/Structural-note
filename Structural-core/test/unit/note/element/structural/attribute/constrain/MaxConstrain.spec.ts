import { describe, it, expect, beforeEach } from "vitest"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { MaxConstrain } from "@/note/element/structural/attribute/constrain/MaxConstrain"
import { ValidValidateResult } from "@/note/element/structural/attribute/ValidateResult"

describe("MaxConstrain", () => {
    let max_constrain: MaxConstrain<number>

    beforeEach(() => {
        max_constrain = new MaxConstrain<number>(100, "number")
    })

	it("constructor", () => {
        expect(max_constrain.max).toBe(100)
        expect(max_constrain.valueType).toBe("number")
        expect(max_constrain.validate_constrain_result.valid).toBe(true)
	})

	it("empty constructor", () => {
        max_constrain = new MaxConstrain<number>()
        expect(max_constrain.max).toBeNull()
        expect(max_constrain.valueType).toBeNull()
        expect(max_constrain.validate_constrain_result.valid).toBe(false)
	})

    it("get set max", () => {
        max_constrain.max = 1
        expect(max_constrain.max).toBe(1)
        expect(max_constrain.validate_constrain_result.valid).toBe(true)

        max_constrain.max = null
        expect(max_constrain.max).toBeNull()
        expect(max_constrain.validate_constrain_result.valid).toBe(false)
    })

    it("get set valueType", () => {
        max_constrain.valueType = "string"
        expect(max_constrain.valueType).toBe("string")
    })

    it("constrainIsValid", () => {
        expect(max_constrain.validate_constrain_result.valid).toBe(true)

        max_constrain.max = null
        expect(max_constrain.validate_constrain_result.valid).toBe(false)
    })

    it("isCompatibleTo", () => {
        // compatible to MaxConstrain?
        let new_max_constrain = new MaxConstrain<number>(1, "number")
        expect(max_constrain.isCompatibleTo(new_max_constrain)).toBe(false)
        
        // compatible to MinConstrain?
        // - max value smaller than min value
        let min_constrain = new MinConstrain<number>(999, "number")
        expect(max_constrain.isCompatibleTo(min_constrain)).toBe(false)

        // - max value greater than min value
        min_constrain.min = 7
        expect(max_constrain.isCompatibleTo(min_constrain)).toBe(true)
    })

    it("validate", () => {
        expect(max_constrain.validate(-9)).toBe(ValidValidateResult)
        expect(max_constrain.validate(100)).toBe(ValidValidateResult)
        expect(max_constrain.validate(999).valid).toBe(false)
    })

    it("json", () => {
        let saved_json = max_constrain.saveAsJson()
        let loaded_max_constrain = MaxConstrain.loadFromJson(saved_json)
        expect(loaded_max_constrain).toEqual(max_constrain)
    })

    it("different type", () => {
        // date
        let date_max_constrain = new MaxConstrain<Date>(new Date(2020, 1, 1), "date")
        expect(date_max_constrain.validate(new Date(2020, 1, 1))).toBe(ValidValidateResult)
        expect(date_max_constrain.validate(new Date(2019, 12, 30))).toBe(ValidValidateResult)
        expect(date_max_constrain.validate(new Date(2020, 1, 2)).valid).toBe(false)
    })
})
