import { EditPathNode, AttributeValue } from "structural-core"
import MtAttributeValueString from "@/components/mt/attribute/value/string.vue"
import MtAttributeValueNumber from "@/components/mt/attribute/value/number.vue"

export function attrValueComponentMapper(child: EditPathNode){
    switch((child as AttributeValue<any>).definition_type_str){
        case "STRING":
            return MtAttributeValueString
        case "NUMBER":
            return MtAttributeValueNumber
    }
}