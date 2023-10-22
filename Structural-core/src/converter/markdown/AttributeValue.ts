import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute"
import { IntegerAttribute, DecimalAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { MarkdownAttribute } from "@/note/element/structural/attribute/type/MarkdownAttribute"
import { ConverterHelper } from "@/converter/ConverterHelper"

export class AttributeValueMarkdownConverter {
    static convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>): string {
        // no type => must have no value => invalid
        if (attr_def.attribute_type === null || !element.is_set_for_required){
            return ""
        }

        // convert value
        let value = ""
        if (attr_def.attribute_type instanceof BooleanAttribute){
            value = this.fromBoolean(element)
        } else if (attr_def.attribute_type instanceof IntegerAttribute){
            value = this.fromInteger(element)
        } else if (attr_def.attribute_type instanceof DecimalAttribute){
            value = this.fromDecimal(element)
        } else if (attr_def.attribute_type instanceof StringAttribute){
            value = this.fromString(element)
        } else if (attr_def.attribute_type instanceof MarkdownAttribute){
            value = this.fromMarkdown(element)
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
        return element.value.toString()
    }

    static fromDecimal(element: AttributeValue<number>): string {
        if (element.value === null){
            return ""
        }
        return element.value.toFixed(4)
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