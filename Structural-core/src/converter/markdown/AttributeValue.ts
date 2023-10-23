import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { AttributeTypeEnum } from "@/note/element/structural/attribute/type/AttributeType"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { ConverterHelper } from "@/converter/ConverterHelper"

export class AttributeValueMarkdownConverter {
    static convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>): string {
        // no type => must have no value => invalid
        if (attr_def.attribute_type === null || !element.is_set){
            return ""
        }

        // convert value
        let value = ""
        switch (attr_def.attribute_type.type){
            case AttributeTypeEnum.BOOLEAN:
                value = this.fromBoolean(element)
                break
            case AttributeTypeEnum.INT:
                value = this.fromInteger(element)
                break
            case AttributeTypeEnum.DECIMAL:
                value = this.fromDecimal(element)
                break
            case AttributeTypeEnum.STRING:
                value = this.fromString(element)
                break
            case AttributeTypeEnum.MARKDOWN:
                value = this.fromMarkdown(element)
                break
        }

        if (value == ""){
            return ""
        }
        return `**${attr_def.name}**: ${value}`
    }

    static fromBoolean(element: AttributeValue<boolean>): string {
        if (element.value){
            return "true"
        } else {
            return "false"
        }
    }

    static fromInteger(element: AttributeValue<number>): string {
        if (element.value === null){
            return ""
        }
        return NumberAttribute.convertToString(element.value)
    }

    static fromDecimal(element: AttributeValue<number>): string {
        if (element.value === null){
            return ""
        }
        return NumberAttribute.convertToString(element.value, 4)
    }

    static fromString(element: AttributeValue<string>): string {
        if (element.value === null){
            return ""
        }
        return element.value
    }

    static fromMarkdown(element: AttributeValue<string>): string {
        if (element.value === null){
            return ""
        }
        return "\n" + ConverterHelper.indentMarkdownHeader(element.value, 3)
    }
}