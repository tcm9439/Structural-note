import { describe, it, expect, vi } from "vitest"
import { ModuleInit } from "@/ModuleInit"
import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer"

describe("ModuleInit", () => {
    it("init", () => {
        const spy = vi.spyOn(AttributeTypeInitializer, 'initialize')
        ModuleInit.init()
        expect(spy).toHaveBeenCalled()
    })
})