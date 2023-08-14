import { describe, it, expect, beforeEach } from "vitest"
import { AttributeValue, AttributeDefinition, StringAttribute } from "@/note/section/structural"

describe('AttributeValue', () => {
	let value: AttributeValue<any>
    let definition: AttributeDefinition<any>

    beforeEach(() => {
        definition = new AttributeDefinition("test", StringAttribute.instance)
        value = new AttributeValue(definition, "Hello World")
    })

    it('constructor', () => {
        expect(value).not.toBeNull()
    })

    it('definition', () => {
        expect(value.definition).toBe(definition)
    })

    it('value getter setter', () => {
        expect(value.value).toBe("Hello World")
        value.value = "Foo Bar"
        expect(value.value).toBe("Foo Bar")
    })
})
