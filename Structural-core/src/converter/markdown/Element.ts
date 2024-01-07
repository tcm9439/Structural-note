import { AttributeValueMarkdownConverter } from "./AttributeValue.js"
import { BaseElementConverter, ElementConverter } from "../BaseElementConverter.js"
import { ConverterHelper } from "@/converter/ConverterHelper.js"
import { TextElement } from "@/note/element/TextElement.js"
import { NoteElement } from "@/note/element/NoteElement.js"

export class ElementMarkdownConverter extends BaseElementConverter {
    constructor(){
        super(new AttributeValueMarkdownConverter())
    }

    convert(element: NoteElement): string {
        let converter = BaseElementConverter.getDefaultConverterMap()
        converter.set("Text", ElementMarkdownConverter.fromText as ElementConverter)
        return super._convert(element, converter)
    }

    static fromText(converter: BaseElementConverter, element: TextElement): string {
        return ConverterHelper.escapeMarkdown(element.content)
    }
}