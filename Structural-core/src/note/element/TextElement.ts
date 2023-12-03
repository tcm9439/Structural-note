import { NoteElement, NoteElementJson } from "@/note/element/NoteElement"
import { z } from "zod"
import { InvalidJsonFormatException } from "@/exception/ConversionException"

export const TextElementJson = NoteElementJson.extend({
    type: z.literal("TextElement"),
    content: z.string()
}).required()

/**
 * A note element that is 
 * - not repeated
 * - a text area (a string)
 */
export class TextElement extends NoteElement {
    private _content: string
    
	constructor(content?: string ) {
        super()
		this._content = content || ""
	}

    get content(): string {
        return this._content
    }

    set content(content: string) {
        this._content = content
    }

    saveAsJson(): z.infer<typeof TextElementJson> {
        return {
            type: "TextElement",
            id: this.id,
            content: this.content
        }
    }

    static loadFromJson(json: object): TextElement {
        let result = TextElementJson.safeParse(json)
        if (!result.success) {
            throw new InvalidJsonFormatException("TextElement", result.error.toString())
        }
        const element = new TextElement(result.data.content)
        element.id = result.data.id
        return element
    }
}