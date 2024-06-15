import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { BaseAttributeValueConverter } from "@/converter/BaseAttributeValueConverter.js"
import { AttributeTypeEnum } from "@/note/element/structural/attribute/type/AttributeType"

type AttributeValueConverter = (attr_def: AttributeDefinition<any>, element: AttributeValue<any>) => any

function oriValueMapper(value: any){
    return value
}

export class AttributeValueCsvConverter {
    static default_converter_map: Map<string, AttributeValueConverter> = BaseAttributeValueConverter.getDefaultConverterMap()

    convert(attr_def: AttributeDefinition<any>, element: AttributeValue<any>): any {        
        // no type => must have no value => invalid
        if (attr_def.attribute_type === null || !element.is_set || element.value === null){
            return null
        }

        // convert value
        return AttributeValueCsvConverter.default_converter_map.get(attr_def.attribute_type.type)!(attr_def, element)
    }

    static getDefaultConverterMap(): Map<string, AttributeValueConverter> {
        const converter_map = new Map<string, AttributeValueConverter>()
        converter_map.set(AttributeTypeEnum.BOOLEAN, BaseAttributeValueConverter.fromBoolean)
        converter_map.set(AttributeTypeEnum.INT, oriValueMapper)
        converter_map.set(AttributeTypeEnum.DECIMAL, oriValueMapper)
        converter_map.set(AttributeTypeEnum.STRING, BaseAttributeValueConverter.fromString)
        converter_map.set(AttributeTypeEnum.LONG_STRING, BaseAttributeValueConverter.fromString)
        converter_map.set(AttributeTypeEnum.MARKDOWN, BaseAttributeValueConverter.fromMarkdown)
        converter_map.set(AttributeTypeEnum.ENUM, BaseAttributeValueConverter.fromEnum)
        return converter_map
    }
}