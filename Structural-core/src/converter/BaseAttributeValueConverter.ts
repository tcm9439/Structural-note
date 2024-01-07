import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { AttributeTypeEnum } from "@/note/element/structural/attribute/type/AttributeType.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { NumberAttribute } from "@/note/element/structural/attribute/type/NumberAttribute.js"
import { ConverterHelper } from "./ConverterHelper.js"
import { ConstraintType } from "@/note/element/structural/attribute/constraint/Constraint.js"
import { EnumConstraint } from "@/note/element/structural/attribute/constraint/EnumConstraint.js"
import { EnumAttribute } from "@/note/element/structural/attribute/type/EnumAttribute.js"

export type AttributeValueConverter = (attr_def: AttributeDefinition<any>, element: AttributeValue<any>) => string
export type AttrKeyValueFormatter = (attr_name: string, value: string) => string

export class BaseAttributeValueConverter {
    static default_attr_key_value_formatter: AttrKeyValueFormatter = (attr_name: string, value: string) => `${attr_name}: ${value}`
    static default_converter_map: Map<string, AttributeValueConverter> = BaseAttributeValueConverter.getDefaultConverterMap()

    static getDefaultConverterMap(): Map<string, AttributeValueConverter> {
        const converter_map = new Map<string, AttributeValueConverter>()
        converter_map.set(AttributeTypeEnum.BOOLEAN, BaseAttributeValueConverter.fromBoolean)
        converter_map.set(AttributeTypeEnum.INT, BaseAttributeValueConverter.fromInteger)
        converter_map.set(AttributeTypeEnum.DECIMAL, BaseAttributeValueConverter.fromDecimal)
        converter_map.set(AttributeTypeEnum.STRING, BaseAttributeValueConverter.fromString)
        converter_map.set(AttributeTypeEnum.MARKDOWN, BaseAttributeValueConverter.fromMarkdown)
        converter_map.set(AttributeTypeEnum.ENUM, BaseAttributeValueConverter.fromEnum)
        return converter_map
    }

    protected static convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>, 
            converter?: Map<string, AttributeValueConverter> | null, 
            attr_key_value_formatter?: AttrKeyValueFormatter | null): string {

        converter = converter ?? BaseAttributeValueConverter.default_converter_map
        attr_key_value_formatter = attr_key_value_formatter ?? BaseAttributeValueConverter.default_attr_key_value_formatter
        
        // no type => must have no value => invalid
        if (attr_def.attribute_type === null || !element.is_set || element.value === null){
            return ""
        }

        // convert value
        let value = converter.get(attr_def.attribute_type.type)!(attr_def, element)
        return attr_key_value_formatter(attr_def.name, value)
    }

    convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>){
        return BaseAttributeValueConverter.convert(attr_def, element)
    }

    static fromBoolean(attr_def: AttributeDefinition<any>, element: AttributeValue<boolean>): string {
        if (element.value){
            return "true" // TODO translate
        } else {
            return "false"
        }
    }

    static fromInteger(attr_def: AttributeDefinition<any>, element: AttributeValue<number>): string {
        return NumberAttribute.convertToString(element.value!)
    }

    static fromDecimal(attr_def: AttributeDefinition<any>, element: AttributeValue<number>): string {
        return NumberAttribute.convertToString(element.value!)
    }

    static fromString(attr_def: AttributeDefinition<any>, element: AttributeValue<string>): string {
        return element.value!
    }

    static fromMarkdown(attr_def: AttributeDefinition<any>, element: AttributeValue<string>): string {
        return "\n" + ConverterHelper.indentMarkdownHeader(element.value!, 3)
    }

    static fromEnum(attr_def: AttributeDefinition<any>, element: AttributeValue<number>): string {
        // get the enumConstrain from the attr_def
        const enum_constraint = attr_def.getConstraint(ConstraintType.ENUM) as EnumConstraint | null
        if (enum_constraint === null){
            return "default"
        }

        const converter_param = { 
            enum: enum_constraint.getAvailableValuesMap()
        }

        return EnumAttribute.convertToString(
            element.value!, 
            converter_param
        )
    }
}