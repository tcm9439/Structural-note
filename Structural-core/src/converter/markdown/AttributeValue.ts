import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { BaseAttributeValueConverter } from "@/converter/BaseAttributeValueConverter.js"
import { AttributeTypeEnum } from "@/note/element/structural/attribute/type/AttributeType.js"
import { ConverterHelper } from "@/converter/ConverterHelper.js"

export class AttributeValueMarkdownConverter extends BaseAttributeValueConverter {
    convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>): string {
        let converter = BaseAttributeValueConverter.getDefaultConverterMap()
        converter.set(AttributeTypeEnum.STRING, AttributeValueMarkdownConverter.fromString)
        converter.set(AttributeTypeEnum.LONG_STRING, AttributeValueMarkdownConverter.fromString)
        
        return BaseAttributeValueConverter.convert(attr_def, element, 
            converter,
            (attr_name: string, value: string) => `**${attr_name}**: ${value}`)
    }

    static fromString(attr_def: AttributeDefinition<any>, element: AttributeValue<string>): string {
        return ConverterHelper.escapeMarkdown(element.value!)
    }
}