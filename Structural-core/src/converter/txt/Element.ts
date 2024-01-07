import { AttributeValueTxtConverter } from "./AttributeValue.js"
import { BaseElementConverter, ElementConverter } from "../BaseElementConverter.js"
import { NoteElement } from "@/note/element/NoteElement.js"
import { MarkdownElement } from "@/note/element/MarkdownElement.js"

export class ElementTxtConverter extends BaseElementConverter {
    constructor(){
        super(new AttributeValueTxtConverter())
    }

    convert(element: NoteElement): string {
        let converter = BaseElementConverter.getDefaultConverterMap()
        converter.set("Markdown", ElementTxtConverter.fromMarkdown as ElementConverter)
        return super._convert(element, converter)
    }

    static fromMarkdown(converter: BaseElementConverter, element: MarkdownElement): string {
        return element.content
    }
}