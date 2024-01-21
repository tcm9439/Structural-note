import { type EditPathNode, AttributeValue } from "@structural-note/structural-core"

export function attrValueComponentMapper(child: EditPathNode){
    return (child as AttributeValue<any>).definition_type_str
}