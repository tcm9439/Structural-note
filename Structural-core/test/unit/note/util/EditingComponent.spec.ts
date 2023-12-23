import { describe, it, expect, beforeEach, vi } from "vitest"
import { EditingComponent } from "@/note/util/EditingComponent.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"

describe("EditingComponent", () => {
    let commit_callback: (new_component: AttributeDefinition<string>) => void
    let rollback_callback: (untainted_component: AttributeDefinition<string>) => void
    let editing_component: EditingComponent<AttributeDefinition<string>>
    let attr_def: AttributeDefinition<string>

    beforeEach(() => {
        commit_callback = vi.fn()
        rollback_callback = vi.fn()
        attr_def = new AttributeDefinition("test")
        editing_component = new EditingComponent(attr_def, commit_callback, rollback_callback)
    })

	it("constructor", () => {
        expect(editing_component.untainted).toBe(attr_def)
        expect(editing_component.editing.name).toBe("test")
        expect(editing_component.untainted.name).toBe("test")
        expect(editing_component.hasCommit).toBe(false)
        expect(editing_component["_commit_callback"]).toBe(commit_callback)
        expect(editing_component["_rollback_callback"]).toBe(rollback_callback)
	})

	it("constructor null callback", () => {
        editing_component = new EditingComponent(attr_def)
        expect(editing_component["_commit_callback"]).toBe(null)
        expect(editing_component["_rollback_callback"]).toBe(null)
	})

    it("get editing", () => {
        expect(editing_component.editing).toEqual(attr_def)
        expect(editing_component.editing.name).toBe("test")
        editing_component.editing.name = "test2"
        attr_def.name = "test3"
        expect(editing_component.editing.name).toBe("test2")
    })

    it("commit & hasCommit", () => {
        expect(editing_component.hasCommit).toBe(false)
        editing_component.commit()
        expect(editing_component.hasCommit).toBe(true)
        expect(commit_callback).toHaveBeenCalledTimes(1)
    })

    it("rollback & hasCommit", () => {
        expect(editing_component.hasCommit).toBe(false)
        editing_component.rollback()
        expect(editing_component.hasCommit).toBe(false)
        expect(rollback_callback).toHaveBeenCalledTimes(1)

        editing_component.commit()
        expect(editing_component.hasCommit).toBe(true)
        expect(commit_callback).toHaveBeenCalledTimes(1)

        editing_component.rollback()
        expect(editing_component.hasCommit).toBe(true)
        expect(rollback_callback).toHaveBeenCalledTimes(2)
    })
})
