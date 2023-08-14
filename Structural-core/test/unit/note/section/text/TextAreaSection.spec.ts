import { describe, it, expect, beforeEach } from "vitest"
import { TextAreaSection } from "@/note/section/text/TextAreaSection"

describe("TextAreaSection", () => {
    let text_area_section: TextAreaSection
    beforeEach(() => {
        text_area_section = new TextAreaSection("Title ABC")
    })

    it("create text area section", () => {
        expect(text_area_section.title).toBe("Title ABC")
    })

    it("get set content", () => {
        text_area_section.content = "Content ABC"
        expect(text_area_section.content).toBe("Content ABC")

        text_area_section.content = "Content DEF"
        expect(text_area_section.content).toBe("Content DEF")
    })
})
