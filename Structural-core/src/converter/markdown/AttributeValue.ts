import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { BaseAttributeValueConverter } from "@/converter/BaseAttributeValueConverter"

export class AttributeValueMarkdownConverter extends BaseAttributeValueConverter {
    convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>): string {
        return BaseAttributeValueConverter.convert(attr_def, element, 
            null, 
            (attr_name: string, value: string) => `**${attr_name}**: ${value}`)
    }
}