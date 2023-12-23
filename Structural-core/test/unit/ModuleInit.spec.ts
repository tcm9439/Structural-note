import { describe, it, expect, vi } from "vitest"
import { ModuleInit } from "@/ModuleInit.js"
import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer.js"

describe("ModuleInit", () => {
    it("init", () => {  
        const spy = vi.spyOn(AttributeTypeInitializer, 'initialize')
        ModuleInit.init()
        expect(spy).toHaveBeenCalled()
    })
})