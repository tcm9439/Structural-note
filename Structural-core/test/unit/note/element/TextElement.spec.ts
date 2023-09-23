import { describe, it, expect, beforeEach } from "vitest"
import { TextElement } from "@/note/element/TextElement"

describe("TextAreaSection", () => {
    let text_area_section: TextElement
    beforeEach(() => {
        text_area_section = new TextElement()  
    })

    it("constructor", () => {
        expect(text_area_section).toBeDefined()
        expect(text_area_section.content).toBe("")

        let text_area_section_2 = new TextElement("Content ABC")
        expect(text_area_section_2.content).toBe("Content ABC")
    })

    it("get set content", () => {
        text_area_section.content = "Content ABC"
        expect(text_area_section.content).toBe("Content ABC")

        text_area_section.content = "Content DEF"
        expect(text_area_section.content).toBe("Content DEF")
    })

    it("saveAsJson", () => {
        text_area_section.content = "Content ABC"
        expect(text_area_section.saveAsJson()).toEqual({
            type: "TextElement",
            id: text_area_section.id,
            content: "Content ABC"
        })
    })

    it("loadFromJson", () => {
        let json = text_area_section.saveAsJson()
        let text_area_section_2 = TextElement.loadFromJson(json)
        expect(text_area_section_2).toEqual(text_area_section)
    })
})
