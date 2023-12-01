import { describe, it, expect, beforeEach } from "vitest"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain"
import { ValidOperationResult } from "@/common/OperationResult"

describe("RequireConstrain", () => {
	it("validate", () => {
        let require = new RequireConstrain(true)
        expect(require.validate(null).valid).toEqual(false)
        expect(require.validate("").valid).toEqual(false)
        expect(require.validate("Test")).toEqual(ValidOperationResult)
        
        let optional = new RequireConstrain(false)
        expect(optional.validate(null)).toEqual(ValidOperationResult)
        expect(optional.validate("")).toEqual(ValidOperationResult)
        expect(optional.validate("Test")).toEqual(ValidOperationResult)
	})

    it("saveAsJson", () => {
        let require = new RequireConstrain(true)
        expect(require.saveAsJson()).toEqual({
            id: require.id,
            type: "RequireConstrain",
            required: true
        })

        let optional = new RequireConstrain(false)
        expect(optional.saveAsJson()).toEqual({
            id: optional.id,
            type: "RequireConstrain",
            required: false
        })
    })

    it("loadFromJson", () => {
        let require = new RequireConstrain(true)
        let json = require.saveAsJson()
        expect(RequireConstrain.loadFromJson(json)).toEqual(require)

        let optional = new RequireConstrain(false)
        json = optional.saveAsJson()
        expect(RequireConstrain.loadFromJson(json)).toEqual(optional)
    })
})
