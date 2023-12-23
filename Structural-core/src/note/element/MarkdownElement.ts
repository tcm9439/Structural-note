import { TextElement, TextElementJson } from "@/note/element/TextElement.js"
import { InvalidJsonFormatException } from "@/exception/ConversionException.js"

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

    static loadFromJson(json: object): MarkdownElement {
        let result = MarkdownElementJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("MarkdownElement", result.error.toString())
        }
        const element = new MarkdownElement(result.data.content)
        element.id = result.data.id
        return element
    }
}