import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition, BooleanAttribute } from "@/note/element/structural"

describe('BooleanAttribute', () => {
	it("instance", () => {
        expect(BooleanAttribute.instance).not.toBeNull()
    })

    it("create", () => {
        let definition = new AttributeDefinition("test", BooleanAttribute.instance)
        let value = BooleanAttribute.instance.create(definition, false)
        
        expect(value.definition).toBe(definition)
        expect(value.value).toBe(false)
    })
})
