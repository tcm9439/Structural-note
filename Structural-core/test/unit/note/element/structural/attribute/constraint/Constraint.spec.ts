import { describe, it, expect, beforeEach } from "vitest"
import { ConstraintType } from "@/note/element/structural/attribute/constraint/Constraint.js"
import { MinConstraint } from "@/note/element/structural/attribute/constraint/MinConstraint.js"
import { MaxConstraint } from "@/note/element/structural/attribute/constraint/MaxConstraint.js"
import { EditPath, EndOfEditPathError } from "@/note/util/EditPath.js"

describe("Constraint", () => {
	it("getNextEditPathNode", () => {
        const constraint = new MinConstraint(0)
        expect(constraint.getNextEditPathNode("1234")).toBeUndefined()
	})

    it("stepInEachChildren", () => {
        const constraint = new MinConstraint(0)
        let edit_path = new EditPath()
        expect(() => constraint.stepInEachChildren(edit_path)).toThrow(EndOfEditPathError)
    })

    it("isCompatibleTo", () => {
        const constraint = new MinConstraint(0)
        expect(constraint.isCompatibleTo(new MinConstraint(1))).toBe(false)
        expect(constraint.isCompatibleTo(new MaxConstraint(366))).toBe(true)
    })

    it("isCompatibleToType", () => {
        const constraint = new MinConstraint(0)
        expect(constraint.isCompatibleToType(ConstraintType.MIN)).toBe(false)
        expect(constraint.isCompatibleToType(ConstraintType.MAX)).toBe(true)
    })

    it("filterOutIncompatible", () => {
        const constraint = new MinConstraint(0)
        expect(constraint.filterOutIncompatible([ConstraintType.MIN, ConstraintType.MAX])).toEqual([ConstraintType.MAX])
    })
})
