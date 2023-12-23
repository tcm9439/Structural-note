import { NoteElement } from "@/note/element/NoteElement.js"
import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { TextElement } from "@/note/element/TextElement.js"
import { MarkdownElement } from "@/note/element/MarkdownElement.js"
import { ConverterHelper, StringBuilder } from "../ConverterHelper.js"
import { AttributeValueMarkdownConverter } from "./AttributeValue.js"

export class ElementMarkdownConverter {
    static convert(element: NoteElement): string {
        let element_str = ""
        if (element instanceof MarkdownElement){
            element_str = this.fromMarkdown(element)
        } else if (element instanceof TextElement){
            element_str = this.fromText(element)
        } else if (element instanceof StructuralElement){
            element_str = this.fromStruct(element)
        }
        return new StringBuilder().appendEmptyLine().appendLine(element_str).toString()
    }

    static fromText(element: TextElement): string {
        return element.content
    }

    static fromMarkdown(element: MarkdownElement): string {
        return ConverterHelper.indentMarkdownHeader(element.content, 2)
    }

    static fromStruct(element: StructuralElement): string {
        let result = new StringBuilder()
        element.definition.attributes.ordered_components.forEach((attr_def) => {
            let value = element.values.get(attr_def.id)
            if (value === undefined){
                return
            }
            let converted_value = AttributeValueMarkdownConverter.convert(attr_def, value)
            if (converted_value !== ""){
                result.appendLine(converted_value)
            }
        })
        return result.toString()
    }
}