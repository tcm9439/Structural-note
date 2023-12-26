import { describe, it, expect, beforeEach } from "vitest"
import { RequireConstraint } from "@/note/element/structural/attribute/constraint/RequireConstraint.js"
import { ValidOperationResult } from "@/common/OperationResult.js"

describe("RequireConstraint", () => {
	it("validate", () => {
        let require = new RequireConstraint(true)
        expect(require.validate(null).valid).toEqual(false)
        expect(require.validate("").valid).toEqual(false)
        expect(require.validate("Test")).toEqual(ValidOperationResult)
        
        let optional = new RequireConstraint(false)
        expect(optional.validate(null)).toEqual(ValidOperationResult)
        expect(optional.validate("")).toEqual(ValidOperationResult)
        expect(optional.validate("Test")).toEqual(ValidOperationResult)
	})

    it("saveAsJson", () => {
        let require = new RequireConstraint(true)
        expect(require.saveAsJson()).toEqual({
            id: require.id,
            type: "RequireConstraint",
            required: true
        })

        let optional = new RequireConstraint(false)
        expect(optional.saveAsJson()).toEqual({
            id: optional.id,
            type: "RequireConstraint",
            required: false
        })
    })

    it("loadFromJson", () => {
        let require = new RequireConstraint(true)
        let json = require.saveAsJson()
        expect(RequireConstraint.loadFromJson(json)).toEqual(require)

        let optional = new RequireConstraint(false)
        json = optional.saveAsJson()
        expect(RequireConstraint.loadFromJson(json)).toEqual(optional)
    })
})
