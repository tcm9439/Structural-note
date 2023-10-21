import { TextElement, TextElementJson } from "@/note/element/TextElement"
import { z } from "zod"

export const MarkdownElementJson = TextElementJson.extend({
    type: z.literal("MdElement"),
    content: z.string(),
}).required()

export class MarkdownElement extends TextElement {
    saveAsJson(): z.infer<any> {
        return {
            type: "MdElement",
            id: this.id,
            content: this.content
        }
    }

    static loadFromJson(json: object): MarkdownElement | null {
        let result = MarkdownElementJson.safeParse(json)
        if (!result.success) {
            console.error("Failed to load TextElement from JSON", json)
            console.error(result.error)
            return null
        }
        const element = new MarkdownElement(result.data.content)
        element.id = result.data.id
        return element
    }
}