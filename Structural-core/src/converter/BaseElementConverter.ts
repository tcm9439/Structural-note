import { NoteElement } from "@/note/element/NoteElement.js"
import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { TextElement } from "@/note/element/TextElement.js"
import { MarkdownElement } from "@/note/element/MarkdownElement.js"
import { ConverterHelper, StringBuilder } from "./ConverterHelper.js"
import { BaseAttributeValueConverter } from "./BaseAttributeValueConverter.js"

export type ElementConverter = (converter: BaseElementConverter, element: NoteElement) => string
export type ElementFormatter = (element_str: string) => string

export class BaseElementConverter {
    static default_element_formatter: ElementFormatter = (element_str: string) => new StringBuilder().appendEmptyLine().appendLine(element_str).toString()
    static default_converter_map: Map<string, ElementConverter> = BaseElementConverter.getDefaultConverterMap()
    
    protected _attr_value_converter: BaseAttributeValueConverter

    constructor(attr_value_converter?: BaseAttributeValueConverter){
        this._attr_value_converter = attr_value_converter ?? new BaseAttributeValueConverter()
    }

    static getDefaultConverterMap(): Map<string, ElementConverter> {
        const converter_map = new Map<string, ElementConverter>()
        converter_map.set("Markdown", BaseElementConverter.fromMarkdown as ElementConverter)
        converter_map.set("Text", BaseElementConverter.fromText as ElementConverter)
        converter_map.set("Struct", BaseElementConverter.fromStruct as ElementConverter)
        return converter_map
    }

    protected _convert(element: NoteElement, 
        converter?: Map<string, ElementConverter> | null, 
        element_formatter?: ElementFormatter): string {

        converter = converter ?? BaseElementConverter.default_converter_map
        element_formatter = element_formatter ?? BaseElementConverter.default_element_formatter

        let element_str = ""
        if (element instanceof MarkdownElement){
            element_str = converter.get("Markdown")!(this, element)
        } else if (element instanceof TextElement){
            element_str = converter.get("Text")!(this, element)
        } else if (element instanceof StructuralElement){
            element_str = converter.get("Struct")!(this, element)
        }
        return element_formatter(element_str)
    }

    convert(element: NoteElement): string {
        return this._convert(element)
    }

    static fromText(converter: BaseElementConverter, element: TextElement): string {
        return element.content
    }

    static fromMarkdown(converter: BaseElementConverter, element: MarkdownElement): string {
        return ConverterHelper.indentMarkdownHeader(element.content, 2)
    }

    static fromStruct(converter: BaseElementConverter, element: StructuralElement): string {
        let result = new StringBuilder()
        element.definition.attributes.ordered_components.forEach((attr_def) => {
            let value = element.values.get(attr_def.id)
            if (value === undefined){
                return
            }
            let converted_value = converter._attr_value_converter.convert(attr_def, value)
            if (converted_value !== ""){
                result.appendLine(converted_value)
            }
        })
        return result.toString()
    }
}