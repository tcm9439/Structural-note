import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { TranslatableText, TranslatableTextElement, TranslationManager } from "@/index.js"

describe("TranslatableTextElement", () => {
    let translationManager = new TranslationManager("en")

	it("simple TranslatableTextElement ", () => {
        let text = new TranslatableTextElement("test.no_parameter")
        expect(text.toDisplayText(translationManager)).toBe("Hello!")
    })
})

describe("TranslatableText", () => {
    let translationManager = new TranslationManager("en")
    
    beforeAll(() => {
        TranslatableText.translationManager = translationManager
    })

	it("simple TranslatableText ", () => {
        let text = TranslatableText.new("test.no_parameter")
        expect(text.toDisplayText()).toBe("Hello!")
        expect(text.toDisplayText(translationManager)).toBe("Hello!")
    })

    it("TranslatableText with named parameter", () => {
        let text = TranslatableText.new("test.named_parameter", {name: "World"})
        expect(text.toDisplayText(translationManager)).toBe("Hello World!")
    })

    it("TranslatableText with component", () => {
        let text = TranslatableText.new("test.named_parameter", {name: "World"})
            .addRawElement("test.named_parameter2", {first_name: "John", last_name: 'Doe'})
            .addRawElement("test.no_parameter")
        expect(text.toDisplayText(translationManager)).toBe("Hello World! Hello John Doe! Hello!")
    })

    it("TranslatableText with component", () => {
        let text = TranslatableText.new("test.named_parameter", {
                name: TranslatableText.new("test.named_parameter2", {first_name: "John", last_name: 'Doe'})
            })
        expect(text.toDisplayText(translationManager)).toBe("Hello Hello John Doe!!")
    })
})
