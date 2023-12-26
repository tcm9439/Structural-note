import { describe, it, expect, beforeEach } from "vitest"
import { RequireConstraint } from "@/note/element/structural/attribute/constraint/RequireConstraint.js"
import { ValidOperationResult } from "@/common/OperationResult.js"

describe("RequireConstraint", () => {
	it("validate", () => {
        let require = new RequireConstraint()
        expect(require.validate(null).valid).toEqual(false)
        expect(require.validate("").valid).toEqual(false)
        expect(require.validate("Test")).toEqual(ValidOperationResult)
	})

    it("saveAsJson", () => {
        let require = new RequireConstraint()
        expect(require.saveAsJson()).toEqual({
            id: require.id,
            type: "RequireConstraint"
        })
    })

    it("loadFromJson", () => {
        let require = new RequireConstraint()
        let json = require.saveAsJson()
        expect(RequireConstraint.loadFromJson(json)).toEqual(require)
    })
})
