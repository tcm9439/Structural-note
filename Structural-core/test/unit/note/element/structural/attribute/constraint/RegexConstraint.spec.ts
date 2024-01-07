import { describe, it, expect, beforeEach } from "vitest"
import { RegexConstraint, ValidOperationResult } from "@/index"
import _ from "lodash"

describe("RegexConstraint", () => {
    let regex_constraint: RegexConstraint

    beforeEach(() => {
        regex_constraint = new RegexConstraint("[0-3]{4}")
    })

	it("constructor", () => {
        expect(regex_constraint.pattern).toEqual("[0-3]{4}")
        expect(regex_constraint.validate_constraint_result.valid).toBe(true)
	})

    it("get set pattern", () => {
        regex_constraint.pattern = "[0-3]{4}"
        expect(regex_constraint.pattern).toEqual("[0-3]{4}")
        expect(regex_constraint["_regex"]).toEqual(/^[0-3]{4}$/)
        expect(regex_constraint.validate_constraint_result.valid).toBe(true)
        
        regex_constraint.pattern = "[0-3][4"
        expect(regex_constraint.pattern).toEqual("[0-3][4")
        expect(regex_constraint["_regex"]).toEqual(/^.*$/)
        expect(regex_constraint.validate_constraint_result.valid).toBe(false)
    })

    it("isCompatibleTo", () => {
        let new_regex_constraint = new RegexConstraint()
        expect(regex_constraint.isCompatibleTo(new_regex_constraint)).toBe(false)
    })

    it("validate", () => {
        expect(regex_constraint.validate("0003")).toBe(ValidOperationResult)
        expect(regex_constraint.validate("2001")).toBe(ValidOperationResult)
        expect(regex_constraint.validate("2001 ")).toBe(ValidOperationResult)
        expect(regex_constraint.validate("bb").valid).toBe(false)
        expect(regex_constraint.validate("2001 4").valid).toBe(false)
    })

    it("json", () => {
        let saved_json = regex_constraint.saveAsJson()
        let loaded_regex_constraint = RegexConstraint.loadFromJson(saved_json)
        expect(loaded_regex_constraint).toEqual(regex_constraint)
    })

    it("more escape char test", () => {
        let user_input = "\\[\\+852-[0-9]{8}\\]"
        let string_that_should_match = "[+852-12345678]"
        expect((new RegExp(user_input).test(string_that_should_match))).toBe(true)

        regex_constraint.pattern = user_input
        expect(regex_constraint.pattern).toEqual(user_input)
        expect(regex_constraint.validate_constraint_result.valid).toBe(true)
        expect(regex_constraint.validate(string_that_should_match)).toBe(ValidOperationResult)
        expect(regex_constraint.validate("12345678").valid).toBe(false)
    })

    it("more escape char test2", () => {
        let user_input = "[0-1]{2}\\+\\[abc\\]\\$\\^\\.\\*\\?"
        let string_that_should_match = "01+[abc]$^.*?"
        expect((new RegExp(user_input).test(string_that_should_match))).toBe(true)

        regex_constraint.pattern = user_input
        expect(regex_constraint.pattern).toEqual(user_input)
        expect(regex_constraint.validate_constraint_result.valid).toBe(true)
        expect(regex_constraint.validate("01+[abc]$^.*?")).toBe(ValidOperationResult)
    })
})
