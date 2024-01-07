import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { BaseAttributeValueConverter } from "@/converter/BaseAttributeValueConverter"
import { AttributeTypeEnum } from "@/note/element/structural/attribute/type/AttributeType"

export class AttributeValueTxtConverter extends BaseAttributeValueConverter {
    convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>): string {
        let converter = BaseAttributeValueConverter.getDefaultConverterMap()
        converter.set(AttributeTypeEnum.MARKDOWN, AttributeValueTxtConverter.fromMarkdown)
        
        return BaseAttributeValueConverter.convert(attr_def, element, converter)
    }

    static fromMarkdown(attr_def: AttributeDefinition<any>, element: AttributeValue<string>): string {
        return "\n" + element.value
    }
}