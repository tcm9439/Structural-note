import { describe, it, expect, beforeEach } from "vitest"
import { Constrain, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { MaxConstrain } from "@/note/element/structural/attribute/constrain/MaxConstrain"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath"

describe("Constrain", () => {
	it("getNextEditPathNode", () => {
        const constrain = new MinConstrain(0)
        expect(constrain.getNextEditPathNode("1234")).toBeUndefined()
	})

    it("stepInEachChildren", () => {
        const constrain = new MinConstrain(0)
        let edit_path = new EditPath()
        expect(() => constrain.stepInEachChildren(edit_path)).toThrow(EndOfEditPathError)
    })

    it("isCompatibleTo", () => {
        const constrain = new MinConstrain(0)
        expect(constrain.isCompatibleTo(new MinConstrain(1))).toBe(false)
        expect(constrain.isCompatibleTo(new MaxConstrain(366))).toBe(true)
    })

    it("isCompatibleToType", () => {
        const constrain = new MinConstrain(0)
        expect(constrain.isCompatibleToType(ConstrainType.MIN)).toBe(false)
        expect(constrain.isCompatibleToType(ConstrainType.MAX)).toBe(true)
    })

    it("filterOutIncompatible", () => {
        const constrain = new MinConstrain(0)
        expect(constrain.filterOutIncompatible([ConstrainType.MIN, ConstrainType.MAX])).toEqual([ConstrainType.MAX])
    })
})
